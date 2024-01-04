const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const WomenHistoryToPatientSchema = new mongoose.Schema({
    value: {type: Boolean, require: true},
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},  
    WomenHistoryId: { type: mongoose.Schema.ObjectId, ref: "WomenHistory"},
    
})
WomenHistoryToPatientSchema.plugin(timestamp);
const WomenHistoryToPatient = mongoose.model("WomenHistoryToPatient",WomenHistoryToPatientSchema);
module.exports = WomenHistoryToPatient;