const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ReligionSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
ReligionSchema.plugin(timestamp);
const Religion = mongoose.model("Religion",ReligionSchema);
module.exports = Religion;