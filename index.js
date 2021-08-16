const express = require('express');
const fs = require('fs');
const upload = require('./middleware/multer');
const createAppDir = require('./middleware/createDir');
const addDockerfile = require('./helpers/addDockerfile');
const cors = require('cors');
const dockerCLI = require('docker-cli-js');
const DockerOptions = dockerCLI.Options;
const Docker = dockerCLI.Docker;

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());


const pushImage = (res, docker, imageName) => {
  const username = 'stevenaraka';
  const uri = `${username}/${imageName}`;

  docker.command(`tag ${imageName} ${uri} && docker push ${uri}`)
    .then((data) => {
      console.log('data = ', data);

      return res.status(200).send({
        message: 'Image build successful',
        uri
      });
    })
    .catch((error) => {
      console.log('error: ', error);
      return 0;
    });
}

/**
 * Build the image
 */
const buildImage = (res, dir, image) => {
  const options = new DockerOptions(null, `./uploads/${dir}`, true);   //machine_name:str (null = use local docker), wd:str, echo_output:bool
  const docker = new Docker(options);

  addDockerfile(dir);

  docker.command(`build -t ${image} .`)
    .then((data) => {
      console.log('data = ', data);
      pushImage(res, docker, image);
    })
    .catch((error) => {
      console.log('error: ', error);
      res.send('Image build failed');
      return;
    });
}

app.post("/upload", createAppDir, upload.array("files"), (req, res) => {
  const { imageName } = req.body;
  const { appDir } = req;

  buildImage(res, appDir, imageName);
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));