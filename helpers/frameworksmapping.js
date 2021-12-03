

/**
 * Select framework docker file
 *'NodeJS'
 *'React'
 *'Html-CSS-JS'
 * 
 */
const nodeProjectFilter = require("../helpers/nodeProjectFilter");

 const frameworksmapping = (framework) => {
    let dockerPath
    switch(framework)  {
        case 'Html-CSS-JS':
            dockerPath= './preset_dockerfiles/html-nginx.txt';
            break;
        case 'NodeJS':
          //  nodeProjectFilter(dir);
            dockerPath= './preset_dockerfiles/nodejs.txt';
            break;
        case 'React':
            dockerPath= './preset_dockerfiles/reactjs.txt'; 
            break;     
    }
    return dockerPath;
}

module.exports = frameworksmapping;