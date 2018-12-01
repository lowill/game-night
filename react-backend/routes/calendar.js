const express = require('express');
const router = express.Router();

const validator = require('validator');

const db_actions = require('../db_actions');
const inspect = require('util').inspect;

const Utils = require('../utils/Utils.js');

const DatabaseUtils = require('../utils/DatabaseUtils.js');
const db = DatabaseUtils.connect();

/* Fetch all times for group */
router.post('/', function(req, res, next) {
  const group = validator.escape(req.body.group);

  Promise.resolve(db)
    .then(db => db_actions.get_group_calendar(db, group))
    .then(rows => {
      res.send({
        statuses: rows
      });
    })
    .catch(next);
});

router.post('/status', function(req, res, next) {
  const args = Utils.escapeObject(req.body);

  Promise.resolve(db)
    .then(db => {
      return db_actions.get_status(db, args.group, args.username);
    })
    .then(rows => {
      res.send({
        statuses: rows 
      });
    })
    .catch(console.error)
});

/* POST availability listing. */
router.post('/time', function(req, res, next) {
  const args = Utils.escapeObject(req.body);

  Promise.resolve(db)
    .then(db => {
      db_actions.update_time_slot(db, args.group, args.username, args.timeslot, args.code);
    })
    .then(() => {
      res.send({
        status: 'ok'
      });
    })
    .catch(next);
});

module.exports = router;
