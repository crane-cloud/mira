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
 * ? Do they provide both the image_name and tag ?
 * TODO - wd should later be dynamic
 */
const buildImage = (res, imageName, tag) => {
  exec(`docker build -q -t ${imageName}:${tag} .`, {
    cwd: './uploads'
  }, (error, stdout, stderr) => {
    if (error) {                                //! failure
      console.log(`error: ${error.message}`);
      res.send('Image build failed');
      return;
    }

    console.log(`\n${stdout}`);                 // success
    return res.send('Image build successful')
  })
}

app.post("/upload", upload.array("files"), (req, res) => {
  const { imageName, tag } = req.body;

  addDockerfile();
  buildImage(res, imageName, tag);
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));