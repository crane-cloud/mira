const fs = require('fs');

/*
*remove build files like node_modules
*/
const nodeProjectFilter = (folderPath) => {

  if (fs.existsSync(`${folderPath}/node_modules`)){
      fs.rmdir(`${folderPath}/node_modules`, { recursive: true }, (err) => {
    if (err) throw err;
    console.log(`modules is deleted!`);
    });
  }
  if (fs.existsSync(`${folderPath}/yarn.lock`)){
    fs.unlink(`${folderPath}/yarn.lock`,function (err){
        if(err) throw err;
        console.log('yarn.lock deleted')
      });
  }
  if (fs.existsSync(`${folderPath}/package-lock.json`)){
    fs.unlink(`${folderPath}/package-lock.json`,function (err){
        if(err) throw err;
        console.log('package-lock.json deleted')
      });
  }
  if (fs.existsSync(`${folderPath}/Dockerfile`)){
    fs.unlink(`${folderPath}/Dockerfile`,function (err){
        if(err) throw err;
        console.log( 'Docker file deleted')
      });
  }
}

module.exports = nodeProjectFilter;