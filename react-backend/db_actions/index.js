const fs = require('fs');

let files = fs.readdirSync('./db_actions');
module.exports = files.reduce((filesList, file) => {
  if(file.startsWith('.') || file === 'index.js') return filesList;
  const key = file.replace(/-/g, '_');
  filesList[key] = require(`./${file}`);
  return filesList;
}, {});