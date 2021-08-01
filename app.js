var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    findOrCreate = require('mongoose-find-or-create');

var FoodType = require("./models/foodType"),
    Food     = require("./models/food"),
    User     = require("./models/user"),
    seedDB   = require("./seed");


mongoose.connect("mongodb://localhost/DigiMenu", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

seedDB();


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Attack on titan is the best anime ever",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE TO PASS currentUser
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


/* **** Landing Page Route **** */
app.get("/", function(req, res) {
    res.render("landing");
});


/* **** Index Page Route **** */
app.get("/menu", function(req, res) {
    FoodType.find({}).populate("foods").exec(function(err, foodTypes) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {foodTypes: foodTypes});
        }
    });
});


/* **** Create Page **** */
app.post("/menu", function(req, res) {
    FoodType.findOrCreate({name: req.body.foodTypeName}, {name: req.body.foodTypeName, image: req.body.foodTypeImage}, function(err, foodType) {
        if(err) {
            console.log(err);
            res.redirect("/menu");
        } else {
            Food.create(req.body.food, function(err, food) {
                if(err) {
                    console.log(err);
                    res.redirect("/menu");
                } else {
                    foodType.foods.push(food);
                    foodType.save();
                    res.redirect("/menu/new")
                }
            });
        }
    });
});


/* **** New Page **** */
app.get("/menu/new", function(req, res) {
    FoodType.find({}, function(err, foodTypes) {
        if(err) {
            console.log(err);
        } else {
            res.render("new", {foodTypes: foodTypes});
        }
    });
});


/* **** Authentication Routes **** */


app.get("/signup", function(req, res){
    res.render("signup");
});


app.post("/signup", function(req, res) {
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

app.get("/login", function(req, res) {
    res.render("login")
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/menu",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res) {
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



app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Digi Menu server has started");
})