var express = require('express');
var router = express.Router();
var async = require('async');

router.get("/", function (req, res, next) {
    if(res.locals.loggedinUser) {
        async.parallel({
            feedback_requests: function(callback) {
                var params;
                if(res.locals.loggedinUserRole === 'admin') {
                    $query="SELECT f.feedback_id,f.consultant_id,f.link_date,c.name as Consultant,c.email \n\
                            FROM consultants c,feedback f \n\
                            WHERE c.consultantid=f.consultant_id AND f.status=0 ORDER BY f.feedback_id DESC";
                }
                else{
                    params = res.locals.loggedinUserId;
                    $query="SELECT f.feedback_id,f.consultant_id,f.link_date,c.name as Consultant,c.email \n\
                            FROM consultants c,feedback f \n\
                            WHERE c.consultantid=f.consultant_id AND f.status=0 AND f.company_id = " + params;    
                }
                global.objConn.query($query, function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            }
        }, 
        function (err, result) {
            if(err)
                res.redirect('/');
            res.render("feedback_requests", result);
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});
module.exports = router;