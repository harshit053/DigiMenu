var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    findOrCreate = require('mongoose-find-or-create');

var FoodType = require("./models/foodType"),
    Food     = require("./models/food"),
    seedDB   = require("./seed");


mongoose.connect("mongodb://localhost/DigiMenu", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


seedDB();

// Landing Page
app.get("/", function(req, res) {
    res.render("landing");
});


//Index Page
app.get("/menu", function(req, res) {
    FoodType.find({}).populate("foods").exec(function(err, foodTypes) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {foodTypes: foodTypes});
        }
    });
});


//Create Page
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


//New Page
app.get("/menu/new", function(req, res) {
    FoodType.find({}, function(err, foodTypes) {
        if(err) {
            console.log(err);
        } else {
            res.render("new", {foodTypes: foodTypes});
        }
    });
});




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Digi Menu server has started");
})