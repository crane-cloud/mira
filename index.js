const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dockerCLI = require('docker-cli-js');
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

/**
 * Multer create file storage engine and store
 * TODO - make directory dynamic i.e. /uploads/{someID}
 *  
 */
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: fileStorageEngine });


const pushImage = (res, docker, imageName, tag) => {
  const username = 'stevenaraka';
  const image = `${imageName}:${tag}`;
  const uri = `${username}/${image}`;
  
  docker.command(`tag ${image} ${uri} && docker push ${uri}`)
    .then((data) => {
      console.log('data = ', data);

      return res.status(200).send({
        uri,
        message: 'Image build successful'
      });
    })
    .catch((error) => {
      console.log('error: ', error);
      return 0;
    });
}

/**
 * Copy a Dockerfile in dockerfiles folder, add to uploaded files directory
 * TODO - logic for determning which dockerfile to choose 
 */
const addDockerfile = () => {
  fs.copyFile('./dockerfiles/html/Dockerfile', './uploads/Dockerfile', (err) => {
    if (err) throw err;
    console.log('Dockerfile copied to destination.txt');
  });
}

/**
 * Access terminal and build the image
 * ? Do they provide both the image_name and tag ?
 * TODO - wd should later be dynamic
 */
const buildImage = (res, imageName, tag = "latest") => {
  const options = new DockerOptions(null, './uploads', true);   //machine_name:str (null = use local docker), wd:str, echo_output:bool

  const docker = new Docker(options);

  docker.command(`build -t ${imageName}:${tag} .`)
    .then((data) => {
      console.log('data = ', data);
      pushImage(res, docker, imageName, tag);
    })
    .catch((error) => {
      console.log('error: ', error);
      res.send('Image build failed');
      return;
    });
}

app.post("/upload", upload.array("files"), (req, res) => {
  const { imageName, tag } = req.body;

  addDockerfile();
  buildImage(res, imageName, tag);
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));