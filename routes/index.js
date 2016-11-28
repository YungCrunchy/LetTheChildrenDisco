var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Let The Children Techno', servers: req.RTC_CLIENTS});
});


module.exports = router;
