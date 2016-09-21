var express = require('express');
var router = express.Router();
var async = require('async');


router.get("/", function (req, res, next) {
    if(res.locals.loggedinUser) {
        async.parallel({
            consultants: function(callback) {
                objConn.query("SELECT * FROM consultants ORDER BY name ASC", function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            },
            companies: function(callback) {
                objConn.query("SELECT * FROM companies ORDER BY name ASC", function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            },
            consultant_companies: function(callback) {
                objConn.query("SELECT cc.*,c.name as Consultant,com.name as Company \n\
                               FROM consultants c,companies com,consultant_company cc \n\
                               WHERE c.consultantid=cc.consultantid AND com.companyid=cc.companyid \n\
                               ORDER BY cc.id DESC", function (err, result, fields){
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
                res.redirect('/?error=Något gick fel!');
            res.render("consultant_companies", result);
        });
    }
});

router.post("/", function (req, res) {
    if(res.locals.loggedinUser) {    
        objConn.query("INSERT INTO consultant_company (consultantid, companyid) VALUES (?,?)", [req.body.consultants, req.body.companies], function (err, content, fields) {
            if(err){
                throw err;
            }else{
                res.redirect("/consultant_companies");
            }
        });
    }
});    
module.exports = router;
