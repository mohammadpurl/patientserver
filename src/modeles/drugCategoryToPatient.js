const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const DrugCategoryToPatientSchema = new mongoose.Schema({    
    drugCategoryId:{ type: mongoose.Schema.ObjectId, ref: "DrugCategory"},
    ageStarted:{type:Number, required:true},
    patientId:{ type: mongoose.Schema.ObjectId, ref: "Patient"},
    regularlyUseId:{ type: mongoose.Schema.ObjectId, ref: "RegularlyUse"},
    howManyYears:{type:Number, required:true},
    lastUseId:{ type: mongoose.Schema.ObjectId, ref: "LastUse"},    
    
})
DrugCategoryToPatientSchema.plugin(timestamp);
const DrugCategoryTopatient = mongoose.model("DrugCategoryTopatient",DrugCategoryToPatientSchema);
module.exports = DrugCategoryTopatient;

