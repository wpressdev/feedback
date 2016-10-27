var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get("/", function (req, res, next) {
    res.render('admin/signin', {title: 'Signin'});
});

router.post('/', passport.authenticate('local'), function (req, res){
    res.redirect('/admin/home');
});

module.exports = router;
