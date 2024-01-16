const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MenHistoryToPatientSchema = new mongoose.Schema({
    erectileDysfunction: {type: Boolean, require: true},
    reducedLibido: {type: Boolean, require: true},
    frequentUrinationsinDay: {type: Boolean, require: true},
    frequentUrinationsinNight: {type: Boolean, require: true},
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},  
   
    
})
MenHistoryToPatientSchema.plugin(timestamp);
const MenHistoryToPatient = mongoose.model("MenHistoryToPatient",MenHistoryToPatientSchema);
module.exports = MenHistoryToPatient;