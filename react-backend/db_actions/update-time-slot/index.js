module.exports = function(db, group, username, timeslot, code) {
  const tableName = `calendar_${group}`;
  return db.query(`
    REPLACE
    INTO ?? ( name, timeslot, code )
    VALUES ( ?, ?, ? )
  `,
    [tableName, username, timeslot, code]
  );
}