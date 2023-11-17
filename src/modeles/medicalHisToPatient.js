const { string } = require('mathjs');
const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MedicalHisToPatientSchema = new mongoose.Schema({    
    value : {type: string, require: true},
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},
    medicalHisId:{ type: mongoose.Schema.ObjectId, ref: "MedicalHistory"},
})
MedicalHisToPatientSchema.plugin(timestamp);
const MedicalHisToPatient = mongoose.model("MedicalHisToPatient",MedicalHisToPatientSchema);
module.exports = MedicalHisToPatient;