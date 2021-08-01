var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");


/* **** Landing Page Route **** */

router.get("/", function(req, res) {
    res.render("index/landing");
});

/* **** Authentication Routes **** */

router.get("/signup", function(req, res){
    res.render("index/signup");
});


router.post("/signup", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/menu");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("index/login")
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/menu",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/menu");
});


//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;