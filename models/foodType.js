var mongoose = require("mongoose");

var foodTypeSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        foods: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food"
            }
        ]
    }
);

module.exports = mongoose.model("FoodType", foodTypeSchema);