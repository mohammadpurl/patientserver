const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MedicationToPatientSchema = new mongoose.Schema({
    drugStrength: {type: Number, require: true},
    dosePerDay: {type: Number, require: true},
    howManydays : {type: Number, require: true},
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},
    medicationId:{ type: mongoose.Schema.ObjectId, ref: "Medication"},
})
MedicationToPatientSchema.plugin(timestamp);
const MedicationToPatient = mongoose.model("MedicationToPatient",MedicationToPatientSchema);
module.exports = MedicationToPatient;