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
  CRANECLOUD_BASE_URL,
} = require("./config");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 4000;

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
    const project = "1f320c75-8b42-401a-9d10-d0b07eabf2c6"; // TODO: shall be dynamic
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjkyNzQ0OTAsIm5iZiI6MTYyOTI3NDQ5MCwianRpIjoiNjcyNWEyZTktNWI3Yy00MjMzLTliMWItYWZlNTEwMGEyNzUzIiwiZXhwIjoxNjMwMTM4NDkwLCJpZGVudGl0eSI6ImJlZDVjODQwLTQ3MjUtNDczYi05MjA1LThiZWM2YThlNWM2YSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyIsInVzZXJfY2xhaW1zIjp7InJvbGVzIjpbeyJpZCI6IjdmN2ZiZGQ5LWMxMGQtNGRiMC1iOTQ3LWUyZDc0MmE2MTlhOSIsIm5hbWUiOiJjdXN0b21lciJ9XX19.0GQ8LnIjm5JLqMyzqfe-9kV2XIeYU_jNVl51TCJt5sc";

    axios
      .post(
        `${CRANECLOUD_BASE_URL}/projects/${project}/apps`,
        {
          image: imageName,
          name: "hello",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err.response));
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
    .command(`build -t ${image}:latest .`)
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
  const { imageName } = req.body;
  const { appDir } = req;

  buildImage(res, appDir, `${DOCKERHUB_USERNAME}/${imageName}`);
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));
