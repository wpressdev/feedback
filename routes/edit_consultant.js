var express = require('express');
var router = express.Router();
var async = require('async');

router.get("/:id", function (req, res) {
    if(res.locals.loggedinUser) {
        res.render('edit_consultant', { title: 'Express' });
        async.parallel({
            consult: function(callback) {
                objConn.query("SELECT * FROM consultants WHERE consultantid = ?", [req.params.id], function (err, result, fields){
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
            res.render("/edit_consultant", result);
        });
    }
});

//router.post('/:id', function (req, res, next) {
//if(res.locals.loggedinUser)
//{
//    var id = req.params.id;
//    console.log(id);
//    res.render('edit_consultant', { title: 'Express' });
//    router.post("/", function (req, res) {
//    objConn.query("UPDATE consultants SET name = ?, email = ? WHERE consultantid = ?",id, [req.body.name, req.body.email], function (err, consultants, fields) {
//        if(err){
//            logger.error(err);
//            res.redirect('/?error=Något gick fel!');
//        }else{
//            res.redirect("/consultants");
//        }
//        });
//    });
//}
//else
//{
//    res.render('signin', {title: 'Signin'});
//}
//});


module.exports = router;
