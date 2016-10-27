var express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {result: {"company_name" : 4}});
});
module.exports = router;