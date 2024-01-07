const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const FamilyHistoryToPatientSchema = new mongoose.Schema({
    value:{type:String, required:true},
    familyHistoryId:{ type: mongoose.Schema.ObjectId, ref: "FamilyHistory"},
    patientId:{ type: mongoose.Schema.ObjectId, ref: "Patient"},
    
   
})
FamilyHistoryToPatientSchema.plugin(timestamp);
const FamilyHistoryTopatient = mongoose.model("FamilyHistoryTopatient",FamilyHistoryToPatientSchema);
module.exports = FamilyHistoryTopatient;

