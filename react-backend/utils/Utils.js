const validator = require('validator');

function escapeObject(obj) {
  const result = {};
  for(let key in obj) {
    if(typeof obj[key] === 'string') result[key] = validator.escape(obj[key]);
    else result[key] = obj[key];
  }
  return result;
}

module.exports = {
  escapeObject: escapeObject
};