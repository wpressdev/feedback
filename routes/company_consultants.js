var express = require('express');
var router = express.Router();
var async = require('async');

router.get("/:id", function (req, res, next) {
    if(res.locals.loggedinUserRole === 'admin') {
        async.parallel({
            consultants: function(callback) {
                global.objConn.query("SELECT cc.*,c.email,c.name as Consultant,com.name as Company \n\
                                      FROM consultants c,companies com,consultant_company cc \n\
                                      WHERE c.consultantid=cc.consultantid AND com.companyid=cc.companyid \n\
                                      AND cc.companyid = ?", [req.params.id], function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            },
            company: function(callback) {
                global.objConn.query("SELECT * FROM companies WHERE companyid = ?", [req.params.id], function (err, company, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, company[0]);
                    }
                });
            }
        }, 
        function (err, result) {
            if(err)
                res.redirect('/');
            res.render("company_consultants", result);
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});
module.exports = router;
