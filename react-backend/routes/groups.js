const express = require('express');
const router = express.Router();
const validator = require('validator');
const db_actions = require('../db_actions');

const db = require('../utils/DatabaseUtils.js').connect();


/* POST group create listing. */
router.post('/create', function(req, res, next) {
  const group = validator.escape(req.body.group_name);
  if(!group) throw new Error('Missing group name.');

  Promise.resolve(db)
    .then(db => {
      db_actions.create_selections_table(db, group);
      return db;
    })
    .then(db => {
      db_actions.create_calendar_table(db, group);
      return db;
    })
    .then(() => {
      res.send({
        status: 'ok'
      });
    })
    .catch(console.error);
});

module.exports = router;
