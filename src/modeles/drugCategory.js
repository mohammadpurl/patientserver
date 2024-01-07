const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const DrugCategorySchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
DrugCategorySchema.plugin(timestamp);
const DrugCategory = mongoose.model("DrugCategory",DrugCategorySchema);
module.exports = DrugCategory;