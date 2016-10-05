var express = require('express'),
    router = express.Router(),
    async = require('async'),
    dateFormat = require("dateformat"),
    now = new Date(),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

var AUTH_USERNAME = process.env.AUTH_USERNAME,
    AUTH_PASSWORD = process.env.AUTH_PASSWORD;

router.get("/", function (req, res, next) {
    if(res.locals.loggedinUserRole === 'admin') {
        async.parallel({
            consultants: function(callback) {
                global.objConn.query("SELECT * FROM consultants ORDER BY name ASC", function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            },
            companies: function(callback) {
                global.objConn.query("SELECT * FROM companies ORDER BY name ASC", function (err, result, fields){
                    if(err){
                        throw err;
                        callback(err);
                    }else{
                       callback(null, result);
                    }
                });
            },
            feedback_links: function(callback) {
                global.objConn.query("SELECT fl.*,c.name as Consultant,com.name as Company \n\
                               FROM consultants c,companies com,feedback fl \n\
                               WHERE c.consultantid=fl.consultant_id AND com.companyid=fl.company_id \n\
                               ORDER BY fl.feedback_id DESC", function (err, result, fields){
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
                res.redirect('/');
            res.render("send_feedback_link", result);
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});

router.post("/", function (req, res) {
    if(res.locals.loggedinUserRole === 'admin') {
        var link_date = dateFormat(now, "yyyy-mm-dd hh:MM:ss");
        var arr_consultant = req.body.consultants.toString().split("+");
        var arr_company = req.body.companies.toString().split("+");
        var consultantid = arr_consultant[0], consultant_name = arr_consultant[1];
        var companyid = arr_company[0], to_email = arr_company[1];
        var emailBody = 'Hello, <br><br> You have received a new feedback request. Please signin to the dashboard by clicking the link below <br> and give your feedback for <b>' + consultant_name + '</b>.<br><br>' +
                        'http://' + req.get('host') + '/signin<br><br>' +
                        '<br> Thanks for your time!<br><br>' +       
                        '<br> Regards,<br><br>Admin<br>';        
        global.objConn.query("INSERT INTO feedback (company_id,consultant_id,link_date,status) VALUES (?,?,?,?)", [companyid,consultantid,link_date,'0'], function (err, content, fields) {
            if(err){
                throw err;
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
                    to: to_email,
                    subject: 'Feedback request',
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
                res.redirect("/feedbacks");
            }
        });
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});
module.exports = router;
