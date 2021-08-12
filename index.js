const express = require('express');
const fs = require('fs');
const upload = require('./middleware/multer');
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');
const cors = require('cors');
const dockerCLI = require('docker-cli-js');
const DockerOptions = dockerCLI.Options;
const Docker = dockerCLI.Docker;

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());

const makeAppDir = (req, res, next) => {
  const appFolderName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals]
  });

  const dir = `./uploads/${appFolderName}`

  if (!fs.existsSync(dir)){          // create folder if not exists TODO: might need to handle "if exists"
    fs.mkdirSync(dir, { recursive: true });
  }
  
  req.appDir = appFolderName;
  next()
};

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
 * Add a preset Dockerfile
 */
const addDockerfile = (dir) => {
  fs.copyFile('./preset_dockerfiles/html-nginx.txt', `./uploads/${dir}/Dockerfile`, (err) => {
    if (err) throw err;
    console.log('Dockerfile copied to destination.txt');
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

app.post("/upload", makeAppDir, upload.array("files"), (req, res) => {
  const { imageName } = req.body;
  const { appDir } = req;

  // buildImage(res, appDir, imageName);
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));