const multer = require("multer");
const getFolderPath = require("../helpers/getFolder");
const getFile = require("../helpers/getFile");



/**
 * Multer create file storage engine and store
 */
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${getFolderPath(req.appDir, file.originalname)}`);
  },
  filename: (req, file, cb) => {
    cb(null, getFile(file.originalname));
    // return name
    req.zipfileDir =`${getFolderPath(req.appDir, file.originalname)}${file.originalname}`;
    req.fileDir = getFolderPath(req.appDir, file.originalname);
    req.fileName = getFile(file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

module.exports = upload;
