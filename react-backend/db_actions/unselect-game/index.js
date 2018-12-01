module.exports = function(db, username, group, gameName) {
  const tableName = `selected_games_${group}`;
  return db.query(`
      DELETE FROM
      ??
      WHERE
      username = ? AND game_name = ?
  `,
    [tableName, username, gameName]
  );
}