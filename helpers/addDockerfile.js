
const fs = require('fs');
const frameworksmapping = require("../helpers/frameworksmapping");

/**
 * Add a preset Dockerfile
 */
 const addDockerfile = (dir, framework,callback) => {
  fs.copyFile( frameworksmapping(framework), `${dir}/Dockerfile`, (err) => {
    if (err) callback(err);
    console.log('Dockerfile copied to destination.txt');
   
    // check for django and add 2 files to app directory
    if(framework == "Django"){
      fs.copyFile( './django_xtras/nginx_default.txt', `${dir}/nginx.default`, (err) => {
        if (err) callback(err);
        console.log('Nginx file copied to destination');
      });
    
         }
    fs.copyFile( './preset_dockerignore/uniform_dockerignore.txt', `${dir}/.dockerignore`, (err) => {
      if (err) callback(err);
      console.log('Docker ignore copied to destination.txt');
      callback(null);
    });


 

  });


}

module.exports = addDockerfile;
