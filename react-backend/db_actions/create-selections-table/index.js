module.exports = function (db, group) {
  const tableName = `selected_games_${group}`;
  return db.query(`
    CREATE TABLE
    IF NOT EXISTS
    ?? (
      username VARCHAR(40) NOT NULL,
      game_name VARCHAR(40) NOT NULL,
      PRIMARY KEY(username, game_name)
    )
  `, 
    [tableName]
  );
}