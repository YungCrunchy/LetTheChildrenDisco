var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  res.render('broadcaster', {title: 'stream music', users: app.exports.peers})
});

module.exports = router;
