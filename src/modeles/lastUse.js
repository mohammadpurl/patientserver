const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const LastUseSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
LastUseSchema.plugin(timestamp);
const LastUse = mongoose.model("LastUse",LastUseSchema);
module.exports = LastUse;