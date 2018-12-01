const Config = require('../../Config.js');
module.exports = function (db, gameName) {
  return db.query(`
    INSERT IGNORE INTO
    ${Config.GAMES_TABLE_NAME} (name)
    VALUES ( ? )
  `,
    [gameName]
  );
}