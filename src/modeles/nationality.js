const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const NationalitySchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
NationalitySchema.plugin(timestamp);
const Nationality = mongoose.model("Nationality",NationalitySchema);
module.exports = Nationality;