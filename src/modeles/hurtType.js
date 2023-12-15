const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const HurtTypeSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
HurtTypeSchema.plugin(timestamp);
const HurtType = mongoose.model("HurtType",HurtTypeSchema);
module.exports = HurtType;