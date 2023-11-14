const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PatientSchema = new mongoose.Schema({    
    User: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    Religion:{ type: mongoose.Schema.ObjectId, ref: "Religion"},
    Nationality:{ type: mongoose.Schema.ObjectId, ref: "Nationality"},
    Sexuality:{ type: mongoose.Schema.ObjectId, ref: "Sexuality"},
    MStatus:{ type: mongoose.Schema.ObjectId, ref: "MStatus"},
    Language: [{ type: mongoose.Schema.ObjectId, ref: "Language"}],
    Education:{ type: mongoose.Schema.ObjectId, ref: "Education"},

    firstName:{type: String},
    lastName:{type: String},
    title:{type: String},
    height:{type: Number},
    weight:{type: Number},
    birthDate:{type: Date},
    
    mobileNumber:{type: String},
   
   
    addreess:{type: String},
    // nextofKin:{type: String},
    // nextofKin_Email:{type: String},
    // nextofKin_Mobile:{type: String},
    
    currentOccupation:{type: String},
    hoursWorked:{type: Number},
    
    // dateStamp:{type: Date},
    // iP_Address:{type: Date},
    // guardian_Nominated:{type: Boolean},
    // guardian_Details:Array<string>;
    // other_Practitioners:Array<string>;
})
PatientSchema.plugin(timestamp);
const Patient = mongoose.model("Patient",PatientSchema);
module.exports = Patient;