const express = require('express');
const router = express.Router();
const validator = require('validator');
const DatabaseUtils = require('../utils/DatabaseUtils.js');

const existingTables = [];
const db = DatabaseUtils.connect()
  .then(db => {
    initGameTable(db);
    return db;
  });

const GAMES_DB_NAME = 'games_list';

function initGameTable(db, tableName=GAMES_DB_NAME) {
  if(existingTables.includes(tableName)) return Promise.resolve();

  return db.query(`
    CREATE TABLE
    IF NOT EXISTS
    ${tableName} (
      name VARCHAR(40) NOT NULL,
      PRIMARY KEY(name)
    )
  `)
    .then(existingTables.push(tableName));
}

function addGame(db, gameName) {
  return db.query(`
    INSERT IGNORE INTO
    ${GAMES_DB_NAME} (name)
    VALUES ( ? )
  `,
    [gameName]
  );
}

function getGames(db) {
  return db.query(`
    SELECT
    *
    FROM 
    ${GAMES_DB_NAME}
  `);
}

function getSelectedGames(db, username, group) {
  const tableName = `selected_games_${group}`;

  if(username !== undefined) {
    return db.query(`
      SELECT game_name
      FROM ??
      WHERE username = ?
    `,
      [tableName, username]
    );
  }
  else {
    return db.query(`
      SELECT game_name
      FROM ??
    `,
      [tableName]
    );
  }
}

function initSelectionsTable(db, group) {
  const tableName = `selected_games_${group}`;
  if(existingTables.includes(tableName)) return Promise.resolve();

  return db.query(`
    CREATE TABLE
    IF NOT EXISTS
    ?? (
      username VARCHAR(40) NOT NULL,
      game_name VARCHAR(40) NOT NULL,
      PRIMARY KEY(username, game_name),
      FOREIGN KEY(game_name) REFERENCES games_list(name)
    )
  `, 
    [tableName]
  )
    .then(() => {
      existingTables.push(tableName);
    });
}

function addSelection(db, username, group, gameName) {
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

function removeSelection(db, username, group, gameName) {
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

/**

We need a db of games (gameId, gameName, userId)
if a new game is added, add the game and then return the game ID

we need a db of game selections (gameId, userId, timestamp)
this should be refreshed every week (can just make a new table)

we need a db of users (userId, userName)
*/

/* GET games listing. */
router.get('/', function(req, res, next) {
  // const games = ['Grand Theft Auto 5', 'Civilization V', 'StarCraft II', 'Diablo 3', 'Minecraft', 'Terraria', 'Risk of Rain', 'Neverwinter Nights', 'Civilization IV', 'Civilization III', 'Civilization: Beyond Earth'];
  Promise.resolve(db)
    .then(db => getGames(db))
    .then(result => result.map(item => item.name))
    .then(gameNames => 
      res.send({
        games: gameNames
      })
    )
    .catch(console.error);
});

router.post('/selected', function(req, res, next) {
  const { username, group } = req.body;

  if(username !== undefined) {
    Promise.resolve(db)
      .then(db => {
        return getSelectedGames(db, username, group);
      })
      .then(games => {
        res.send({
          selected_games: games
        });
      });
  }
});

router.post('/select', function(req, res, next) {
  try {
    const username = validator.escape(req.body.username);
    const group = validator.escape(req.body.group);
    const selected_game = validator.escape(req.body.selected_game);

    if(!(username && group && selected_game)) throw new Error('Failed to select games.');

    Promise.resolve(db)
      .then(db => {
        initSelectionsTable(db, group)
          .then(() => addGame(db, selected_game))
          .then(() => addSelection(db, username, group, selected_game))
      })
      .then(() => {
        res.send({
          status: 'ok'
        });
      })
      .catch(console.error);
  }
  catch(error) {
    next(error);
  }
});

router.post('/deselect', function(req, res, next) {
  try {
    console.log(req.body);
    const username = validator.escape(req.body.username);
    const group = validator.escape(req.body.group);
    const deselected_game = validator.escape(req.body.deselected_game);

    if(!(username && group && deselected_game)) throw new Error('Failed to select games.');

    Promise.resolve(db)
      .then(db => {
        removeSelection(db, username, group, deselected_game);
      })
      .then(() => {
        res.send({
          status: 'ok'
        });
      })
      .catch(console.error);
  }
  catch(error) {
    console.error(error);
  }
})

module.exports = router;
