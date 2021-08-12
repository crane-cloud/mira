const fs = require('fs');

const getFolderPath = (appFolder, originalFilename) => {
  const topDir = `./uploads/${appFolder}/`;
  const filePath = originalFilename.substring(0, originalFilename.lastIndexOf("|")).split("|").join("/");
  const folderPath = `${topDir}${filePath}`;

  if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
}

module.exports = getFolderPath;