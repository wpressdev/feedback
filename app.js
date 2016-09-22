/*
    Author: Irfan Ali
*/
var http = require('http'),
    express = require("express"),
    path = require("path"),
    mysql = require("mysql"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    passwordHash = require('password-hash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    md5 = require('md5'),
    flash = require('connect-flash');
    
var environment = process.env.ENVIRONMENT || "production",
    IP_HOST = process.env.IP_HOST,
    USER_ID = process.env.USER_ID,
    USER_KEY = process.env.USER_KEY,
    USER_DB = process.env.USER_DB;

var routes = require('./routes/index');
var signin = require('./routes/signin');
var home = require('./routes/home');
var feedbacks = require('./routes/feedbacks');
var add_consultant = require('./routes/add_consultant');
var edit_consultant = require('./routes/edit_consultant');
var consultants = require('./routes/consultants');
var add_company = require('./routes/add_company');
var companies = require('./routes/companies');
var consultant_companies = require('./routes/consultant_companies');
var feedback_link = require('./routes/feedback_link');

// Database connection
objConn = mysql.createConnection({
        host     : IP_HOST,
        user     : USER_ID,
        password : USER_KEY,
        database : USER_DB,
        multipleStatements: true
    });

var app = express();
// Trusting Openshift proxy
app.enable('trust proxy');

app.set("env", environment);
app.set("logger", logger);
app.set("USER_ID", USER_ID);
app.set("USER_KEY", USER_KEY);
app.set("IP_HOST", IP_HOST);

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'testCat',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// User login
passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        //passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(email, password, done) { // callback with email and password from our form
        objConn.query("SELECT * FROM users WHERE email = ? LIMIT 1;", [email], function (err, user, fields) {
            if(err){
                var errmessage = 'Username or password incorrect';
                return done(null, false, { message: errmessage });
            }else{
                if(user.length == 0){
                    return done(null, false, { message: errmessage });
                }else{
                      if(md5(password)==user[0].password){
                        expressSession = user[0].email;   // Setting session variable
                        return done(null, user);
                    }else{
                        return done(null, false, { message: errmessage });
                    }
                }
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/signin', function(req, res){
  res.render('signin', { title: 'Signin', message: req.flash('signinMessage') });
});

// Setting up the session variables
app.all('*', function (req, res, next) {
  if(req.user){
    res.locals.loggedinUser = true;
    res.locals.loggedinUser = expressSession;
  }
  next();
});

// Sign out
app.get('/signout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/signin');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
});

app.use('/', routes);
app.use('/signin', signin);
app.use('/home', home);
app.use('/feedbacks', feedbacks);
app.use('/consultants', consultants);
app.use('/add_consultant', add_consultant);
app.use('/edit_consultant', edit_consultant);
app.use('/companies', companies);
app.use('/add_company', add_company);
app.use('/consultant_companies', consultant_companies);
app.use('/feedback_link', feedback_link);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = (process.env.PORT || "8080");
app.set("port", port);

var server = http.createServer(app);

server.listen(port);
server.on("error", onError);
console.log('Node app is running on port', app.get('port'));

module.exports = app;

//app.listen(app.get('port'), function() {
//  console.log('Node app is running on port', app.get('port'));
//});