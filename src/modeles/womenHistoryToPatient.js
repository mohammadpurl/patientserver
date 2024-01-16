const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const WomenHistoryToPatientSchema = new mongoose.Schema({    
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},  
    ageOfFirstPeriod: {type: Number, require: true},
    numberOfPregnancies: {type: Number, require: true},
    numberOfMiscarriages: {type: Number, require: true},
    numberOfAbortions: {type: Number, require: true},
    regularMenstrual: {type: Boolean, require: true},
    abnormalPAPSmear: {type: Boolean, require: true},
    lastPapSmearDate: {type: Date},
    bleedingBetweenMenstrual: {type: Boolean, require: true},
})
WomenHistoryToPatientSchema.plugin(timestamp);
const WomenHistoryToPatient = mongoose.model("WomenHistoryToPatient",WomenHistoryToPatientSchema);
module.exports = WomenHistoryToPatient;