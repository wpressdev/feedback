var express = require('express');
var router = express.Router();
var async = require('async');
var passport = require('passport');

router.get("/", function (req, res, next) {
    if(res.locals.loggedinUser) {
        async.parallel({
            feedback_requests: function(callback) {
                var params = res.locals.loggedinUserId;
                global.objConn.query("SELECT f.feedback_id,f.consultant_id,f.link_date,f.status,c.name as Consultant,c.email \n\
                            FROM consultants c,feedback f \n\
                            WHERE c.consultantid=f.consultant_id AND f.company_id = ? ", [params], function (err, result, fields){
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
            res.render("home", result);
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});
router.post('/', passport.authenticate('local'), function (req, res){
    res.redirect('/home');
});
module.exports = router;
