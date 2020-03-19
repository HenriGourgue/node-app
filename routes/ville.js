var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.render('ville', { ville: req.body.nom_ville });
});

module.exports = router;
