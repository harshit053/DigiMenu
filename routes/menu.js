var express  = require("express");
var router   = express.Router();
var FoodType = require("../models/foodType");
var Food     = require("../models/food");

/* **** Index Page Route **** */
router.get("/", function(req, res) {
    FoodType.find({}).populate("foods").exec(function(err, foodTypes) {
        if(err) {
            console.log(err);
        } else {
            res.render("menu/index", {foodTypes: foodTypes});
        }
    });
});


/* **** Create Page **** */
router.post("/", function(req, res) {
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
router.get("/new", function(req, res) {
    FoodType.find({}, function(err, foodTypes) {
        if(err) {
            console.log(err);
        } else {
            res.render("menu/new", {foodTypes: foodTypes});
        }
    });
});

module.exports = router;