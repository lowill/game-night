module.exports = function(db, groupName) {
  const tableName = `calendar_${groupName}`;
  return db.query(`
    CREATE TABLE
    IF NOT EXISTS
    ?? (
      name VARCHAR(40) NOT NULL,
      timeslot BIGINT,
      code TINYINT,
      PRIMARY KEY(name, timeslot)
    )
  `,
    [tableName]
  );
}