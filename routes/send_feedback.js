var express = require('express'),
    router = express.Router(),
    moment = require("moment"),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');
 
var AUTH_USERNAME = process.env.AUTH_USERNAME,
    AUTH_PASSWORD = process.env.AUTH_PASSWORD;

router.get('/:id', function (req, res, next) {
if(res.locals.loggedinUser)
{
    res.render('send_feedback', { title: 'Express' });
    var getid = req.params.id;
    router.post("/", function (req, res) {
    var feedback_date = moment().format('YYYY-MM-DD HH:mm:ss');
    global.objConn.query("SELECT f.company_id,com.name as company,com.email as email FROM companies com,feedback f \n\
                          WHERE com.companyid=f.company_id AND f.feedback_id = ?", [getid], function (err, result, fields) {
        if(err){
            throw err;
        }else{
            var company = result[0].company;
            var from_email = result[0].email;
            var emailBody = 'Hello, <br><br> We have given the feedback for one of your consultant. Please login to the dashboard to view feedback information. Thanks<br><br>' +
                            '<br> Regards,<br><br>' + company +'<br>';   
            var skills = req.body.skills;
            var motivation = req.body.motivation;
            var attitude = req.body.con_attitude;
            var communication = req.body.communication;
            var innovation = req.body.innovation;
            var decision = req.body.decision;
            global.objConn.query("UPDATE feedback SET skills = ?,motivation = ?,attitude = ?,communication = ?,innovation = ?,decision = ?,feedback_date = ?,status = ? WHERE feedback_id = ?", [skills,motivation,attitude,communication,innovation,decision,feedback_date,1,getid], function (err, content, fields) {
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
                        from: from_email,
                        to: AUTH_USERNAME,
                        subject: 'New Feedback',
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
                        res.redirect("/home");
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