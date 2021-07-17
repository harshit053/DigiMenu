var mongoose = require("mongoose");

var foodSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        price: Number
    }
);

module.exports = mongoose.model("Food", foodSchema);