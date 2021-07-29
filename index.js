const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: fileStorageEngine });

app.post("/upload", upload.array("files"), (req, res) => {
  console.log(req.files);
  res.send('Files uploaded')
});

app.listen(PORT, console.log(`listening on PORT ${PORT}`));