const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const LastThirtyToPatientSchema = new mongoose.Schema({
    value: {type: Boolean, require: true},
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},  
    lastThirtyId: { type: mongoose.Schema.ObjectId, ref: "SymptomsThirty"},
    
})
LastThirtyToPatientSchema.plugin(timestamp);
const LastThirtyToPatient = mongoose.model("LastThirtyToPatient",LastThirtyToPatientSchema);
module.exports = LastThirtyToPatient;