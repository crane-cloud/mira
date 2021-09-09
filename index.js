const express = require("express");
const cors = require("cors");

const dockerCLI = require("docker-cli-js");
const DockerOptions = dockerCLI.Options;
const Docker = dockerCLI.Docker;

const upload = require("./middleware/multer");
const createAppDir = require("./middleware/createDir");
const addDockerfile = require("./helpers/addDockerfile");

const {
  DOCKERHUB_USERNAME,
  DOCKERHUB_PASSWORD,
  BASE_URL,
  PORT,
} = require("./config");

const axios = require("axios");
const app = express();

app.use(cors());

app.post("/", createAppDir, upload.array("files"), async (req, res) => {
  const { project, token, framework, name, tag } = req.body;

  try {
    const { appDir } = req;
    addDockerfile(appDir, framework);

    const options = new DockerOptions(null, `./uploads/${appDir}`, true);
    const docker = new Docker(options);

    const image = `${DOCKERHUB_USERNAME}/${name}:${tag}`;

    // auth
    await docker.command(
      `login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}`
    );

    // build
    await docker.command(`build -t ${image} .`);

    // push
    await docker.command(`push ${image}`);

    // deploy
    const deploy = await axios.post(
      `${BASE_URL}/projects/${project}/apps`,
      {
        env_vars: {},
        image: image,
        name: `${name}-${tag}`,
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

    res.status(201).send(deploy.data);
  } catch (error) {
    res.status(error.response.status).send(error.response.data);
  }
});

app.listen(PORT, () => {
  console.log(`...listening on ${PORT}`);
});
