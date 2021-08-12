const fs = require('fs');
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');

const createAppDir = (req, res, next) => {
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

module.exports = createAppDir;