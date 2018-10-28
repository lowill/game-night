var express = require('express');
var router = express.Router();

/* GET games listing. */
router.get('/', function(req, res, next) {
  const games = ['Grand Theft Auto 5', 'Civilization V', 'StarCraft II', 'Diablo 3', 'Minecraft', 'Terraria', 'Risk of Rain', 'Neverwinter Nights', 'Civilization IV', 'Civilization III', 'Civilization: Beyond Earth'];
  res.send({
    games: games
  });
});

router.post('/', function(req, res, next) {
  console.log(req);
});

module.exports = router;
