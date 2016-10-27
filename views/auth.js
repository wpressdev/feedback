var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
},
    function(req, username, password, done) {
        if(username == "admin" && password == "password"){
            return done(null, {id: 1, username: "admin"});
        }
        return done(null, false);
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;