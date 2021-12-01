
const nodeProjectFilter = require("../helpers/nodeProjectFilter");
const fs = require('fs');
const addDockerfile = require("../helpers/addDockerfile");
const unzipper = require('unzipper');
const path =require('path');

 const unzipRepo = (zipDir,toDir,fileName,framework) => {
  // unzip
     fs.createReadStream(zipDir)
     .pipe(unzipper.Extract( {path: toDir }))
     .promise()
     .then( () => {
        //add docker file after unzipping
        addDockerfile(`${toDir}${path.parse(fileName).name}`,framework);
      }
     , e => console.log('error',e)
     );

}

module.exports = unzipRepo;