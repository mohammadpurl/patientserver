const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MenHistoryToPatientSchema = new mongoose.Schema({
    value: {type: Boolean, require: true},
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},  
    MenHistoryId: { type: mongoose.Schema.ObjectId, ref: "MenHistory"},
    
})
MenHistoryToPatientSchema.plugin(timestamp);
const MenHistoryToPatient = mongoose.model("MenHistoryToPatient",MenHistoryToPatientSchema);
module.exports =MenHistoryToPatient;