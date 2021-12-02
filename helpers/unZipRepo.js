
const nodeProjectFilter = require("../helpers/nodeProjectFilter");
const fs = require('fs');
const addDockerfile = require("../helpers/addDockerfile");
const unzipper = require('unzipper');
const path =require('path');

 const unzipRepo = (zipDir,toDir,fileName,framework,callback) => {
  // unzip
     fs.createReadStream(zipDir)
     .pipe(unzipper.Extract( {path: toDir }))
     .promise()
     .then( () => {
        //add docker file after unzipping
        addDockerfile(`${toDir}${path.parse(fileName).name}`
        ,framework,function (err){
         if(err) callback(err);
         callback(null);
        });
      }
     , e => {
        callback(e);
        console.log('error',e)}
     );

}

module.exports = unzipRepo;