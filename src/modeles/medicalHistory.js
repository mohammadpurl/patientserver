const { string } = require('mathjs');
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MedicalHistorySchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
    type: {type: String, require: true},
})
MedicalHistorySchema.plugin(timestamp);
const MedicalHistory = mongoose.model("MedicalHistory",MedicalHistorySchema);
module.exports = MedicalHistory;