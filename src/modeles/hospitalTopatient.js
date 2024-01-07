const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const HospitalTopatientSchema = new mongoose.Schema({
    reason:{type: String, require: true,},   
    date:{type:Date, required:true,},
    hospitalId:{ type: mongoose.Schema.ObjectId, ref: "Hospital"},
    patientId:{ type: mongoose.Schema.ObjectId, ref: "Patient"},
    
   
})
HospitalTopatientSchema.plugin(timestamp);
const Hospital = mongoose.model("HospitalTopatient",HospitalTopatientSchema);
module.exports = Hospital;

