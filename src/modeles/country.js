const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CountrySchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: String, require: true},
})
CountrySchema.plugin(timestamp);
const Country = mongoose.model("Country",CountrySchema);
module.exports = Country;