var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
if(res.locals.loggedinUser)
{
    res.render('add_consultant', { title: 'Express' });
    router.post("/", function (req, res) {
    objConn.query("INSERT INTO consultants (name,email) VALUES (?,?)", [req.body.name,req.body.email], function (err, content, fields) {
        if(err){
            if(err.code !== "ER_DUP_ENTRY"){
                console.log(err);
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
