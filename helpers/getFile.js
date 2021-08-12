
const getFile = (originalFilename) => {
  return originalFilename.split("|").pop();
}

module.exports = getFile;