var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/', function(req, res, next) {
if(res.locals.loggedinUser)
{
  // Displaying consultants
  global.objConn.query("SELECT * FROM consultants ORDER BY consultantid DESC", function(err, consultants) {
  	if(err)
          throw err;
    res.render('consultants', {title: 'Consultants', consultants: consultants});
  });
}
else
{
  res.render('signin', {title: 'Signin'});
}
});

module.exports = router;
