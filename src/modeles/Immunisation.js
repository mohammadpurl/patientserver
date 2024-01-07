const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ImmunisationSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
ImmunisationSchema.plugin(timestamp);
const Immunisation = mongoose.model("Immunisation",ImmunisationSchema);
module.exports = Immunisation;