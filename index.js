const express = require("express");
const upload = require("./middleware/multer");
const createAppDir = require("./middleware/createDir");
const addDockerfile = require("./helpers/addDockerfile");
const cors = require("cors");
const dockerCLI = require("docker-cli-js");
const DockerOptions = dockerCLI.Options;
const Docker = dockerCLI.Docker;

const {
  DOCKERHUB_USERNAME,
  DOCKERHUB_PASSWORD,
  BASE_URL,
  PORT,
} = require("./config");

const axios = require("axios");
const app = express();

app.use(cors());

const pushImage = async (res, docker, imageName) => {
  try {
    // auth
    await docker.command(
      `login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}`
    );

    // push
    await docker.command(`push ${imageName}`);

    // deploy
    const project = "37cc628c-5b9e-4b21-b41d-4d23e4c71769"; // TODO: shall be dynamic
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjkyNzQ0OTAsIm5iZiI6MTYyOTI3NDQ5MCwianRpIjoiNjcyNWEyZTktNWI3Yy00MjMzLTliMWItYWZlNTEwMGEyNzUzIiwiZXhwIjoxNjMwMTM4NDkwLCJpZGVudGl0eSI6ImJlZDVjODQwLTQ3MjUtNDczYi05MjA1LThiZWM2YThlNWM2YSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyIsInVzZXJfY2xhaW1zIjp7InJvbGVzIjpbeyJpZCI6IjdmN2ZiZGQ5LWMxMGQtNGRiMC1iOTQ3LWUyZDc0MmE2MTlhOSIsIm5hbWUiOiJjdXN0b21lciJ9XX19.0GQ8LnIjm5JLqMyzqfe-9kV2XIeYU_jNVl51TCJt5sc";

    const result = await axios.post(
      `${BASE_URL}/projects/${project}/apps`,
      {
        env_vars: {},
        image: imageName,
        name: "demoapp",
        project_id: project,
        private_image: false,
        replicas: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(result.data);
  } catch (err) {
    console.log(err);

    return;
  }
};

/**
 * Build the image
 */
const buildImage = (res, dir, image) => {
  const options = new DockerOptions(null, `./uploads/${dir}`, true); //machine_name:str (null = use local docker), wd:str, echo_output:bool
  const docker = new Docker(options);

  addDockerfile(dir);

  docker
    .command(`build -t ${image} .`)
    .then((data) => {
      console.log("data = ", data);
      pushImage(res, docker, image);
    })
    .catch((error) => {
      console.log("error: ", error);
      res.send("Image build failed");
      return;
    });
};

app.post("/", createAppDir, upload.array("files"), (req, res) => {
  const { name, tag } = req.body;
  const { appDir } = req;
  const imgTag = tag.trim() ? tag : 'latest'

  buildImage(res, appDir, `${DOCKERHUB_USERNAME}/${name}:${imgTag}`);
});

app.listen(PORT, () => {
  console.log(`...listening on ${PORT}`);
});
