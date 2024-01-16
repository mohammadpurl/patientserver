const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const FamilyHistoryToPatientSchema = new mongoose.Schema({
    
    familyTypeId:{ type: mongoose.Schema.ObjectId, ref: "FamilyType"},
    isAlive:{type:Boolean , required:true},
    age:{type:Number},
    healthStatus:{type:String},
    whatAge:{type:Number},
    cause:{type:String},
    patientId:{ type: mongoose.Schema.ObjectId, ref: "Patient"},
    
   
})
FamilyHistoryToPatientSchema.plugin(timestamp);
const FamilyHistoryTopatient = mongoose.model("FamilyHistoryTopatient",FamilyHistoryToPatientSchema);
module.exports = FamilyHistoryTopatient;

