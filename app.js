var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

var FoodType = require("./models/foodType"),
    Food     = require("./models/food"),
    seedDB   = require("./seed");


mongoose.connect("mongodb://localhost/DigiMenu", { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");
app.use(express.static("public"));


seedDB();


app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/menu", function(req, res) {
    FoodType.find({}, function(err, foodTypes) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {foodTypes: foodTypes});
        }
    });
});




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Digi Menu server has started");
})