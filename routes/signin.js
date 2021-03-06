var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get("/", function (req, res, next) {
    res.render('signin', {title: 'Signin'});
});

router.post('/', passport.authenticate('local'), function (req, res){
    res.redirect('/home');
});

module.exports = router;
