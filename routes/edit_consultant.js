var express = require('express'),
    router = express.Router(),
    async = require('async');

router.get("/:id", function (req, res) {
    if(res.locals.loggedinUserRole === 'admin')
    {
        async.parallel({
            consultants: function(callback) {
                global.objConn.query("SELECT * FROM consultants WHERE consultantid = ?", [req.params.id], function (err, result, fields){
                    if(err){
                        callback(err);
                    }else{
                       callback(null, result[0]);
                    }
                });
            },
            companies: function(callback) {
                global.objConn.query("SELECT companyid,name FROM companies WHERE companyid NOT IN (select companyid from consultant_company where consultantid = ?)", [req.params.id], function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            }
        }, function (err, result) {
            if(err)
                res.redirect('/');
            res.render("edit_consultant", result);
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});
    
router.post("/:id", function (req, res) {
    if(res.locals.loggedinUserRole === 'admin')
    {
        var data = req.body.fcompanies;
        global.objConn.query("UPDATE consultants SET designation = ?,location = ? WHERE consultantid = ?", [req.body.designation,req.body.location,req.params.id], function (err, result, fields) {
        if(err){
            if(err.code !== "ER_DUP_ENTRY"){
                //console.log(err);
            }
        }else{
            if(data) {
                for(i=0;i<data.length;i++){
                    global.objConn.query("INSERT INTO consultant_company (consultantid,companyid) values(?,?)", [req.params.id,data[i]], function (err, result, fields) {
                    if(err){
                        if(err.code !== "ER_DUP_ENTRY"){
                            //console.log(err);
                        }
                    }else{
                            //res.redirect("/consultants");
                        }
                    }); 
                }
            }
                res.redirect("/consultants");
            }
        });
    }
    else
    {
        res.render('signin', {title: 'Signin'});
    }  
});
module.exports = router;
