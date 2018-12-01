module.exports = function(db, groupName) {
  const tableName = `calendar_${groupName}`;
  return db.query(`
    SELECT name, timeslot, code
    FROM ??
  `,
    [tableName]);
};