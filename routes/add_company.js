var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
if(res.locals.loggedinUser)
{
    res.render('add_company', { title: 'Express' });
    router.post("/", function (req, res) {
    objConn.query("INSERT INTO companies (name,contact_person,email) VALUES (?,?,?)", [req.body.name,req.body.contact_person,req.body.email], function (err, companies, fields) {
        if(err){
            if(err.code !== "ER_DUP_ENTRY"){
                console.log(err);
            }
        }else{
            res.redirect("/companies");
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
