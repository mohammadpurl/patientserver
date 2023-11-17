const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PatientSchema = new mongoose.Schema({    
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    religion:{ type: mongoose.Schema.ObjectId, ref: "Religion"},
    nationality:{ type: mongoose.Schema.ObjectId, ref: "Nationality"},
    sexuality:{ type: mongoose.Schema.ObjectId, ref: "Sexuality"},
    mStatus:{ type: mongoose.Schema.ObjectId, ref: "MStatus"},
    language: [{ type: mongoose.Schema.ObjectId, ref: "Language"}],
    education:{ type: mongoose.Schema.ObjectId, ref: "Education"},
    country:{ type: mongoose.Schema.ObjectId, ref: "Country"},
    address:{type: String},
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
    
    occupation:{type: String},
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