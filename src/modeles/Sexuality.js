const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const SexualitySchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
SexualitySchema.plugin(timestamp);
const Sexuality = mongoose.model("Sexuality",SexualitySchema);
module.exports = Sexuality;