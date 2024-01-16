const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const FamilyHistoryToPatientSchema = new mongoose.Schema({
    
    familyType:{ type: mongoose.Schema.ObjectId, ref: "FamilyType"},
    isAlive:{type:Boolean, required:true},
    age:{type:Number, required:true},
    healthStatus:{type:String, required:true},
    whatAge:{type:Number, required:true},
    cause:{type:String, required:true},
    patientId:{ type: mongoose.Schema.ObjectId, ref: "Patient"},
    
   
})
FamilyHistoryToPatientSchema.plugin(timestamp);
const FamilyHistoryTopatient = mongoose.model("FamilyHistoryTopatient",FamilyHistoryToPatientSchema);
module.exports = FamilyHistoryTopatient;

