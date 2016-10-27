var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
if(res.locals.loggedinUserRole === 'admin')
{
  global.objConn.query("SELECT f.*,c.name as Consultant,com.name as Company \n\
                               FROM consultants c,companies com,feedback f \n\
                               WHERE c.consultantid=f.consultant_id AND com.companyid=f.company_id \n\
                               ORDER BY f.status ASC", function(err, feedbacks) {
  	if(err)
          throw err;
    res.render('feedbacks', {title: 'Feedbacks', feedbacks: feedbacks});
  });
}
else
{
  res.render('signin', {title: 'Signin'});
}
});
module.exports = router;
