module.exports = function(db, tableName) {
  return db.query(`
    CREATE TABLE
    IF NOT EXISTS
    ${tableName} (
      name VARCHAR(40) NOT NULL,
      PRIMARY KEY(name)
    )
  `);
}