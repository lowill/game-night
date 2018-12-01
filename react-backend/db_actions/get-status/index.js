module.exports = function(db, group, username) {
  const tableName = `calendar_${group}`;
  return db.query(`
    SELECT timeslot, code
    FROM ??
    WHERE name = ?
  `,
    [tableName, username]
  );
}