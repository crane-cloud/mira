

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
        case 'Flask':
            dockerPath= './preset_dockerfiles/flask.txt'; 
            break;   
        case 'Django':
            dockerPath= './preset_dockerfiles/django.txt'; 
            break;  
    }
    return dockerPath;
}

module.exports = frameworksmapping;