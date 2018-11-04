const mysql = require('mysql');

function connect(dbName='game_night', host='127.0.0.1', user='root', password='') {

  const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password
  });

  const query = (sql, args) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, args, (err, rows) => {
        if(err)
          return reject(err);
        resolve(rows);
      });
    });
  };

  const close = () => {
    return new Promise((resolve, reject) => {
      connection.end(err => {
        if(err)
          return reject(err);
        resolve();
      })
    });
  };

  return new Promise((resolve, reject) => {
    query(`
      CREATE DATABASE
      IF NOT EXISTS
      ${dbName}
    `)
      .then(() => {
        connection.query(`
          USE ${dbName}
        `);
      })
      .then(() => {
        resolve({
          connection: connection,
          query: query,
          close: close
        });
      })
      .catch(err => {
        console.error(err);
        reject(err);
        close();
      });
  });

}

module.exports.connect = connect;