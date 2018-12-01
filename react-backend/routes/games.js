const express = require('express');
const router = express.Router();
const validator = require('validator');
const DatabaseUtils = require('../utils/DatabaseUtils.js');
const db_actions = require('../db_actions');

const db = DatabaseUtils.connect()
  .then(db => {
    db_actions.create_games_table(db, `games_list`);
    return db;
  });



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
    .then(db => db_actions.get_games(db))
    .then(result => result.map(item => item.name))
    .then(gameNames => 
      res.send({
        games: gameNames
      })
    )
    .catch(console.error);
});

router.post('/selected', function(req, res, next) {
  const { group } = req.body;

  Promise.resolve(db)
    .then(db => {
      return db_actions.get_game_selections(db, group);
    })
    .then(games => {
      res.send({
        selected_games: games
      });
    });

});

router.post('/select', function(req, res, next) {
  try {
    const username = validator.escape(req.body.username);
    const group = validator.escape(req.body.group);
    const selected_game = validator.escape(req.body.selected_game);

    if(!(username && group && selected_game)) throw new Error('Failed to select games.');

    Promise.resolve(db)
      .then(db => {
        db_actions.create_selections_table(db, group)
          .then(() => db_actions.add_game(db, selected_game))
          .then(() => db_actions.select_game(db, username, group, selected_game))
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
    const username = validator.escape(req.body.username);
    const group = validator.escape(req.body.group);
    const deselected_game = validator.escape(req.body.deselected_game);

    if(!(username && group && deselected_game)) throw new Error('Failed to select games.');

    Promise.resolve(db)
      .then(db => {
        db_actions.unselect_game(db, username, group, deselected_game);
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
