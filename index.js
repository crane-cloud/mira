const express = require("express");
const cors = require("cors");
const dockerCLI = require("docker-cli-js");
const { exec } = require("child_process");
const DockerOptions = dockerCLI.Options;
const Docker = dockerCLI.Docker;
const upload = require("./middleware/multer");
const createAppDir = require("./middleware/createDir");
const unZipRepo = require("./helpers/unZipRepo");
const path = require("path");
const { stdout, stderr } = process;
const fs = require('fs');

const {
  DOCKERHUB_USERNAME,
  DOCKERHUB_PASSWORD,
  BASE_URL,
  PORT,
  IS_ENV_ARM,
  HARBOR_USERNAME,
  HARBOR_PASSWORD,
} = require("./config");

const axios = require("axios");
const { error } = require("console");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to mira API");
});



app.post(
  "/containerize",
  createAppDir,
  upload.array("files"),
  async (req, res) => {
    const { project, token, framework, name, tag, registry } = req.body;
    const { zipfileDir, appDir, fileDir, fileName } = req;
    unZipRepo(zipfileDir, fileDir, fileName, framework, async function (err) {
      if (err) {
        return res.status(500).send(err);
      } else {

        res.writeHead( 200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'X-Content-Type-Options': 'nosniff'
      } );
        try {
          const options = new DockerOptions(
            null,
            `./uploads/${appDir}/${path.parse(fileName).name}`,
            true
          );
          const docker = new Docker(options);
          
          let image = "";

          if (registry === "Harbor") {
            image = `registry.cranecloud.io/autocontainerization-registry/${name}:${tag}`;
            console.log("Accessing Harbor ...");
            // auth
            await docker.command(
              `login -u ${HARBOR_USERNAME} -p ${HARBOR_PASSWORD} registry.cranecloud.io`
            );
          } else {
            console.log("doing Dockerhub login...");

            image = `${DOCKERHUB_USERNAME}/${name}:${tag}`;

            // auth
            await docker.command(
              `login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}`
            );
          }

          stdout.write = (data) => {
            const log = { timestamp: new Date().toISOString(), message: data.toString().trim() };
           
            res.write(JSON.stringify(log))
          };
          
          stderr.write = (data) => {
            const log = { timestamp: new Date().toISOString(), message: data.toString().trim() };
            
            res.write(JSON.stringify(log))
          };

          if (IS_ENV_ARM === "true") {
             await docker.command(
              `buildx build --platform linux/amd64 --push -t ${image} .`);

              
          } else {
            // build
            await docker.command(`build -t ${image} .`);

            // push
            await docker.command(`push ${image}`);
          }
          // deploy
          let port;
          if (framework == "React") {
            port = 3000;
          } else if (framework == "NodeJS") {
            port = 8080;
          } else if (framework == "Flask") {
            port = 5000;
          } else if (framework == "Django") {
            port = 5000;
          } else if (framework == "Laravel" || framework == "Laravel-custom") {
            port = 8000;
          } else {
            port = 80;
          }
          const deploy = await axios.post(
            `${BASE_URL}/projects/${project}/apps`,
            {
              env_vars: {},
              image: image,
              name: `${name}-${tag}`,
              project_id: project,
              private_image: false,
              replicas: 1,
              port: port,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (deploy.status === 201) {
            res.write(JSON.stringify({ timestamp: new Date().toISOString(), message: "App deployed successfully..."}))
            deleteImageProcess = exec(
              `docker image rm ${image}`,
              (err, stdout, stderr) => {
                if (err) {
                  console.error("Error deleting image after deployment:", err);
                  return;
                }
                console.log(
                  "Image deleted successfully after deployment:",
                  stdout
                );
              }
            );
           deleteImageProcess.unref();
          }          
          res.end()
        } catch (error) {
          if(error.message){
           const log =  { timestamp: new Date().toISOString(), message: error.message };
            res.write(JSON.stringify(log))
          }
          res.write(JSON.stringify({ timestamp: new Date().toISOString(), message: "Failed to deploy" }))
          res.end()

        } finally { 
          deleteFolderProcess = exec(
            `rm -rf ./uploads/${appDir}`,
            (err, stdout, stderr) => {
              if (err) {
                console.error("Internal error:", err);
                return;
              }
              console.log(stdout);
            }
          );
          deleteFolderProcess.unref();
        }
      }
    });
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`..Listening on ${PORT}`);
});
