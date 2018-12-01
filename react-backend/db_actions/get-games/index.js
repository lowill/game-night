const Config = require('../../Config.js');

module.exports = function(db) {
  return db.query(`
    SELECT
    *
    FROM 
    ${Config.GAMES_TABLE_NAME}
  `);
};