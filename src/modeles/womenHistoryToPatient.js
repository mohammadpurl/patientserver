const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const WomenHistoryToPatientSchema = new mongoose.Schema({
    value: {type: String, require: true},
    patientId: { type: mongoose.Schema.ObjectId, ref: "Patient"},  
    womenHistoryId: { type: mongoose.Schema.ObjectId, ref: "WomenHistory"},
    
})
WomenHistoryToPatientSchema.plugin(timestamp);
const WomenHistoryToPatient = mongoose.model("WomenHistoryToPatient",WomenHistoryToPatientSchema);
module.exports = WomenHistoryToPatient;