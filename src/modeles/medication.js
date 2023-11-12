const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MedicationSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
MedicationSchema.plugin(timestamp);
const Medication = mongoose.model("Medication",MedicationSchema);
module.exports = Medication;