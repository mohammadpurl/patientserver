const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MStatusSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
MStatusSchema.plugin(timestamp);
const MStatus = mongoose.model("MStatus",MStatusSchema);
module.exports = MStatus;