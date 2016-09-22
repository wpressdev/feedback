var express = require('express'),
    router = express.Router(),
    dateFormat = require("dateformat"),
    now = new Date(),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    flash = require('connect-flash');
    require('dotenv').config();

var AUTH_USERNAME = process.env.AUTH_USERNAME,
    AUTH_PASSWORD = process.env.AUTH_PASSWORD,
    TO_EMAIL = process.env.TO_EMAIL;

/* Post feedback */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  router.post("/", function (req, res) {
    var feedback_date = dateFormat(now, "yyyy-mm-dd hh:MM:ss");
    var emailBody = 'Hello, <br><br> A new user has given the feedback. Following are the feedback information:<br><br><br>' +
                    'Name: ' + req.body.firstname+ ' ' +req.body.lastname + 
                    '<br><br> Email: ' + req.body.email + 
                    '<br><br> Options: ' + req.body.options + 
                    '<br><br> Satisfaction Level: ' + req.body.satisfaction + 
                    '<br><br> Comments: <br>' + req.body.comments + 
                    '<br><br> Date: ' + feedback_date + '<br><br><br><br>' +
                    '<br> Regards,<br><br>Admin<br>';

    objConn.query("INSERT INTO feedback (firstName,lastName,email,options,satisfaction_level,comments,feedback_date) VALUES (?,?,?,?,?,?,?)", [req.body.firstname,req.body.lastname,req.body.email,req.body.options,req.body.satisfaction,req.body.comments,feedback_date], function (err, content, fields) {
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
                    from: req.body.email,
                    to: TO_EMAIL,
                    subject: 'User feedback',
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
                res.redirect("/");
            }
        });
    });
});

module.exports = router;