const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  return res.send('CHECKING YOUR COOKIE');
});

router.post('/settings', function(req, res, next) {
  const reqId = req.cookies['user_id'];
  console.log(reqId);
  if(reqId === undefined) {
    const newId = uuidv4();
    res.cookie('user_id', newId, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
    console.log(`Did not find existing ID. Setting new id: ${newId}`);
  }
  return res.send({status: 'set cookie'});
});

module.exports = router;

