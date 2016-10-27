var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
if(res.locals.loggedinUserRole === 'admin')
{
  global.objConn.query("SELECT * FROM consultants ORDER BY name ASC", function(err, consultants) {
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
