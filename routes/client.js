var express = require('express');
var router = express.Router();

var clients = ["yolo", "swag"];

/* GET home page. */
router.get('/', function(req, res, next ){
  res.render('client', {title: 'Client', clients: req.RTC_CLIENTS})
});


module.exports = router;
