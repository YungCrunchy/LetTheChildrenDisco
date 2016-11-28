var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  res.render('broadcaster', {title: 'stream music', clients: req.RTC_CLIENTS})
});

module.exports = router;
