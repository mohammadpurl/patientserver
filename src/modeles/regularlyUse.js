const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const RegularlyUseSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
RegularlyUseSchema.plugin(timestamp);
const RegularlyUse = mongoose.model("RegularlyUse",RegularlyUseSchema);
module.exports = RegularlyUse;