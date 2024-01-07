const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ImmunisationToPatientSchema = new mongoose.Schema({
    value:{type:Boolean, required:true},
    immunisationId:{ type: mongoose.Schema.ObjectId, ref: "Immunisation"},
    patientId:{ type: mongoose.Schema.ObjectId, ref: "Patient"},
    
   
})
ImmunisationToPatientSchema.plugin(timestamp);
const ImmunisationTopatient = mongoose.model("ImmunisationTopatient",ImmunisationToPatientSchema);
module.exports = ImmunisationTopatient;

