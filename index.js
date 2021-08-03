const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

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

app.post("/upload", upload.array("files"), (req, res) => {
  console.log(req.files);
  
  addDockerfile();
  
  res.send('Files uploaded')
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));