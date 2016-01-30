var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Let The Children Techno' });
});

router.get('/client', function(req, res, next ){
  res.render('client', {title: 'Client'})
});

router.get('/broadcaster', function(req, res, next){
  res.render('broadcaster', {title: 'stream music'})
})

module.exports = router;
