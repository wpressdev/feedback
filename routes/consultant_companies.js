var express = require('express');
var router = express.Router();
var async = require('async');

router.get("/:id", function (req, res, next) {
    if(res.locals.loggedinUserRole === 'admin') {
        async.parallel({
            companies: function(callback) {
                global.objConn.query("SELECT cc.*,com.email,com.name as Contactperson \n\
                                      FROM consultants c,companies com,consultant_company cc \n\
                                      WHERE c.consultantid=cc.consultantid AND com.companyid=cc.companyid \n\
                                      AND cc.consultantid = ?", [req.params.id], function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            },
            consultant: function(callback) {
                global.objConn.query("SELECT * FROM consultants WHERE consultantid = ?", [req.params.id], function (err, consultant, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, consultant[0]);
                    }
                });
            },
            feedbacks: function(callback) {
                global.objConn.query("SELECT f.*,com.name as Company,c.name as Consultant \n\
                                      FROM consultants c,companies com,feedback f \n\
                                      WHERE c.consultantid=f.consultant_id AND com.companyid=f.company_id \n\
                                      AND f.consultant_id = ?", [req.params.id], function (err, feedbacks, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, feedbacks);
                    }
                });
            }
        }, 
        function (err, result) {
            if(err)
                res.redirect('/');
            res.render("consultant_companies", result);
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});
module.exports = router;
