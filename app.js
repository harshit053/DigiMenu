var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    findOrCreate = require('mongoose-find-or-create');

/* Requireing Mongoose Models */
var FoodType = require("./models/foodType"),
    Food     = require("./models/food"),
    User     = require("./models/user"),
    seedDB   = require("./seed");

/* Requireing Routes */
var menuRoutes  = require("./routes/menu"),
    indexRoutes = require("./routes/index");


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

app.use("/", indexRoutes);
app.use("/menu", menuRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Digi Menu server has started");
})