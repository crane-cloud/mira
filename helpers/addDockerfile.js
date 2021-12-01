
const fs = require('fs');
const frameworksmapping = require("../helpers/frameworksmapping");

/**
 * Add a preset Dockerfile
 */
 const addDockerfile = (dir, framework) => {
  fs.copyFile( frameworksmapping(framework,dir), `${dir}/Dockerfile`, (err) => {
    if (err) throw err;
    console.log('Dockerfile copied to destination.txt');
  });
}

module.exports = addDockerfile;
