var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/', function(req, res, next) {
if(res.locals.loggedinUser)
{
  // Displaying companies
  global.objConn.query("SELECT * FROM companies ORDER BY companyid DESC", function(err, companies) {
  	if(err)
          throw err;
    res.render('companies', {title: 'Companies', companies: companies});
  });
}
else
{
  res.render('signin', {title: 'Signin'});
}
});

module.exports = router;
