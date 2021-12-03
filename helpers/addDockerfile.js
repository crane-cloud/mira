
const fs = require('fs');
const frameworksmapping = require("../helpers/frameworksmapping");

/**
 * Add a preset Dockerfile
 */
 const addDockerfile = (dir, framework,callback) => {
  fs.copyFile( frameworksmapping(framework), `${dir}/Dockerfile`, (err) => {
    if (err) callback(err);
    console.log('Dockerfile copied to destination.txt');
    fs.copyFile( './preset_dockerignore/uniform_dockerignore.txt', `${dir}/.dockerignore`, (err) => {
      if (err) callback(err);
      console.log('Docker ignore copied to destination.txt');
      callback(null);
    });
  });
}

module.exports = addDockerfile;
