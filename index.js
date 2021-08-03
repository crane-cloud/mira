const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require("child_process");

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
 */
const buildImage = () => {
  exec(`ls`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    console.log(`\n${stdout}`);
  })
}

app.post("/upload", upload.array("files"), (req, res) => {
  console.log(req.files);
  console.log(req.body.imageName, req.body.tag);
  
  addDockerfile();

  buildImage();
  
  res.send('Files uploaded')
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));