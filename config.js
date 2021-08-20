require("dotenv").config();

const DOCKERHUB_USERNAME = process.env.DOCKERHUB_USERNAME;
const DOCKERHUB_PASSWORD = process.env.DOCKERHUB_PASSWORD;

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

module.exports = {
  DOCKERHUB_USERNAME,
  DOCKERHUB_PASSWORD,
  BASE_URL,
  PORT,
};
