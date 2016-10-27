var express = require('express');
var router = express.Router();
var async = require('async');

router.get("/:id", function (req, res) {
    if(res.locals.loggedinUser)
    {
        async.parallel({
            feedbacks: function(callback) {
                global.objConn.query("SELECT f.*,c.name as Consultant,com.name as Company \n\
                               FROM consultants c,companies com,feedback f \n\
                               WHERE c.consultantid=f.consultant_id AND com.companyid=f.company_id \n\
                               AND f.feedback_id = ?", [req.params.id], function (err, result, fields){
                    if(err){
                        callback(err);
                    }else{
                       callback(null, result[0]);
                    }
                });
            }
        }, function (err, result) {
            if(err)
                res.redirect('/');
            res.render("feedback_detail", result);
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});
module.exports = router;
