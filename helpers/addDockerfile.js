
const fs = require('fs');

/**
 * Add a preset Dockerfile
 */
 const addDockerfile = (dir, framework) => {
  fs.copyFile('./preset_dockerfiles/html-nginx.txt', `./uploads/${dir}/Dockerfile`, (err) => {
    if (err) throw err;
    console.log('Dockerfile copied to destination.txt');
  });
}

module.exports = addDockerfile;
