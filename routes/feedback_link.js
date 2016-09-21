var express = require('express');
var router = express.Router();
var async = require('async');

router.get("/:id", function (req, res, next) {
    if(res.locals.loggedinUser) {
        res.render('feedback_link', { title: 'Express' });
        async.parallel({
            consult: function(callback) {
                objConn.query("SELECT * FROM consultant_company WHERE companyid = ?", [req.params.id], function (err, result, fields){
                    if(err){
                        logger.error(err);
                        callback(err);
                    }else{
                       callback(null, result[0]);
                    }
                });
            },
        }, function (err, result) {
            if(err)
                res.redirect('/?error=Något gick fel!');
            res.render("/feedback_link", result);
        });
    }
});
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
                cat_query = "SELECT u.companyid,u.name,Group_concat(us.consultantid order by id DESC SEPARATOR ' ') consultant_ids,\n\
                               Group_concat(s.name order by id DESC SEPARATOR ' ') consultant_names FROM companies u \n\
                               LEFT JOIN consultant_company us ON u.companyid = us.companyid \n\
                               LEFT  JOIN consultants s ON us.consultantid = s.consultantid \n\
                               GROUP  BY u.companyid,u.name";
                objConn.query(cat_query, function (err, result, fields) {
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       category_check = result;
                       callback(null, result);
                    }
                });
            }
        }, 
        function (err, result) {
            if(err)
                res.redirect('/feedback_link');
            res.render("feedback_link", result);
        });
    }
});



//router.post("/", function (req, res) {
//    if(res.locals.loggedinUser) {    
//        objConn.query("INSERT INTO consultant_company (consultantid, companyid) VALUES (?,?)", [req.body.consultants, req.body.companies], function (err, content, fields) {
//            if(err){
//                throw err;
//            }else{
//                res.redirect("/feedback_link");
//            }
//        });
//    }
//});    
module.exports = router;
