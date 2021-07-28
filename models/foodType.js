var mongoose     = require("mongoose"),
    findOrCreate = require('mongoose-find-or-create');

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
)
foodTypeSchema.plugin(findOrCreate);

module.exports = mongoose.model("FoodType", foodTypeSchema);