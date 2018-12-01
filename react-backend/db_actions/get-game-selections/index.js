module.exports = function(db, group) {
  const tableName = `selected_games_${group}`;
  return db.query(`
    SELECT game_name, username
    FROM ??
  `,
    [tableName]
  );
}