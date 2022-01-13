require("dotenv").config();

const DOCKERHUB_USERNAME = process.env.DOCKERHUB_USERNAME;
const DOCKERHUB_PASSWORD = process.env.DOCKERHUB_PASSWORD;
const HARBOR_USERNAME = process.env.HARBOR_USERNAME;
const HARBOR_PASSWORD = process.env.HARBOR_PASSWORD;

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;
let IS_ENV_ARM =null;
if(process.env.IS_ENV_ARM){ 
  IS_ENV_ARM = process.env.IS_ENV_ARM} 
  else { 
  IS_ENV_ARM = "false"
  };

module.exports = {
  DOCKERHUB_USERNAME,
  DOCKERHUB_PASSWORD,
  BASE_URL,
  PORT,
  IS_ENV_ARM,
  HARBOR_USERNAME,
  HARBOR_PASSWORD,
};
