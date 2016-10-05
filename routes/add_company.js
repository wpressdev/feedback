var express = require('express'),
    router = express.Router(),
    md5 = require('md5'),
    dateFormat = require("dateformat"),
    now = new Date(),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    changeCase = require('change-case');
 
var AUTH_USERNAME = process.env.AUTH_USERNAME,
    AUTH_PASSWORD = process.env.AUTH_PASSWORD;

function randomString(length) {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-@$%&';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

router.get('/', function (req, res, next) {
if(res.locals.loggedinUserRole === 'admin')
{
    res.render('add_company', { title: 'Express' });
    router.post("/", function (req, res) {
    var contact_person = req.body.first_name+req.body.last_name;
    var password = randomString(12);
    var passwordHash = md5(password);
    var register_date = dateFormat(now, "yyyy-mm-dd");
    var username = changeCase.lowerCase(req.body.name);
    global.objConn.query("INSERT INTO users (username,password,email,firstName,lastName,register_date,role) VALUES (?,?,?,?,?,?,?)", [username,passwordHash,req.body.email,req.body.first_name,req.body.last_name,register_date,'user'], function (err, result, fields) {
        if(err){
            if(err.code !== "ER_DUP_ENTRY"){
                console.log(err);
            }
        }else{
            var companyid = result.insertId;
            var emailBody = 'Hello, <br><br> New dashboard account has been created for you. Following are login information: <br><br>' +
                'Username:' + req.body.email + '<br><br>' +
                'Password:' + password + '<br><br>' +
                'Url:' + 'http://' + req.get('host') + '/signin<br><br>' +
                '<br> Regards,<br><br>Admin<br>';        
                global.objConn.query("INSERT INTO companies (companyid,name,contact_person,email,location) VALUES (?,?,?,?,?)", [companyid,req.body.name,contact_person,req.body.email,req.body.location], function (err, companies, fields) {
                    if(err){
                        if(err.code !== "ER_DUP_ENTRY"){
                            console.log(err);
                        }
                    }else{
                        console.log(emailBody);
                        // create reusable transporter object using the default SMTP transport
                        var options = {
                            host: 'smtp.gmail.com', // hostname 
                            secureConnection: true, // use SSL    
                            service: 'gmail',
                            auth: {
                                user: AUTH_USERNAME,
                                pass: AUTH_PASSWORD
                            }
                          };
                        var transporter = nodemailer.createTransport(smtpTransport(options));

                        var mailOptions = {
                            from: AUTH_USERNAME,
                            to: req.body.email,
                            subject: 'Login information',
                            html: emailBody
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, res){
                            if(error){
                                console.log(error);
                            }else{
                                console.log("Message sent: ");
                            }
                            //smtpTransport.close(); // shut down the connection pool, no more messages
                        });                
                        res.redirect("/companies");
                    }
                });            
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
