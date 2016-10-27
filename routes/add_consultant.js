var express = require('express'),
    router = express.Router(),
    async = require('async');

router.get('/', function (req, res, next) {
if(res.locals.loggedinUserRole === 'admin')
{
    res.render('add_consultant', { title: 'Express' });
    router.post("/", function (req, res) {
    global.objConn.query("INSERT INTO consultants (name,email,designation,location) VALUES (?,?,?,?)", [req.body.name,req.body.email,req.body.designation,req.body.location], function (err, result, fields) {
        if(err){
            if(err.code !== "ER_DUP_ENTRY"){
                //console.log(err);
            }
        }else{
                res.redirect("/consultants");
            }
        });
    });
}
else
{
    res.render('signin', {title: 'Signin'});
}
});
module.exports = router;
