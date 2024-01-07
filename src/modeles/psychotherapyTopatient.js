const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PsychotherapyTopatientSchema = new mongoose.Schema({
    when:{type:Date, required:true,},
    psychotherapyId:{ type: mongoose.Schema.ObjectId, ref: "Psychotherapy"},
    patientId:{ type: mongoose.Schema.ObjectId, ref: "Patient"},
    
   
})
PsychotherapyTopatientSchema.plugin(timestamp);
const PsychotherapyTopatient = mongoose.model("PsychotherapyTopatient",PsychotherapyTopatientSchema);
module.exports = PsychotherapyTopatient;

