var express = require('express'),
    router = express.Router(),
    async = require('async'),
    moment = require("moment"),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');

var AUTH_USERNAME = process.env.AUTH_USERNAME,
    AUTH_PASSWORD = process.env.AUTH_PASSWORD;

router.get("/", function (req, res, next) {
    if(res.locals.loggedinUserRole === 'admin') {
        async.parallel({
            companies: function(callback) {
                global.objConn.query("SELECT companyid,name FROM companies ORDER BY name ASC", function (err, result, fields){
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

router.get("/:id", function (req, res, next) {
    if(res.locals.loggedinUserRole === 'admin') {
        var getParam = req.params.id;
        if(getParam) {
            async.parallel({
                companies: function(callback) {
                    global.objConn.query("SELECT companyid,name,email FROM companies ORDER BY name ASC", function (err, companydata, fields){
                        if(err){
                            throw err;
                            callback(err);
                        }else{
                           callback(null, companydata);
                        }
                    });
                },
                company_consultants: function(callback) {
                    global.objConn.query("select cc.companyid,cc.consultantid,c.name as Consultant from consultant_company cc,consultants c where cc.consultantid=c.consultantid AND cc.companyid = ?", [req.params.id], function (err, result, fields){
                        if(err){
                            callback(err);
                        }else{
                           callback(null, result);
                        }
                    });
                },
                company_id: function(callback) {
                    global.objConn.query("SELECT companyid FROM companies where companyid = ?", [getParam], function (err, company_result, fields){
                        if(err){
                            callback(err);
                        }else{
                           callback(null, company_result);
                        }
                    });
                }
            },
            function (err, result) {
                if(err)
                    res.redirect('/');
                res.render('send_feedback_link', result);
            });
        }
    }
    else
    {
      res.render('signin', {title: 'Signin'});
    }
});

router.post("/", function (req, res) {
    if(res.locals.loggedinUserRole === 'admin') {
        var link_date = moment().format('YYYY-MM-DD HH:mm:ss');
        var arr_consultant = req.body.fconsultants.toString().split("+");
        var arr_company = req.body.fcompanies.toString().split("+");
        var consultantid = arr_consultant[0], consultant_name = arr_consultant[1];
        var companyid = arr_company[0], to_email = arr_company[1];
        console.log(consultant_name);
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
