const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const GuardianToPatientSchema = new mongoose.Schema({
    guardian: {
        type: mongoose.Schema.ObjectId, ref: 'User' , require: true
    },
    patient: {
        type: mongoose.Schema.ObjectId, ref: 'Patient', require: true
    },


})
GuardianToPatientSchema.plugin(timestamp);
const GuardianToPatient = mongoose.model("GuardianToPatient",GuardianToPatientSchema);
module.exports = GuardianToPatient;