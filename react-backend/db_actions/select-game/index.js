module.exports = function(db, username, group, gameName) {
  const tableName = `selected_games_${group}`;
  return db.query(`
    INSERT IGNORE INTO
    ?? ( username, game_name )
    VALUES
    ( ?, ? )
  `,
    [tableName, username, gameName]
  );
}