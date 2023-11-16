const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const GuardianToPatientSchema = new mongoose.Schema({
    guardian: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    },
    patient: {
        type: mongoose.Schema.ObjectId, ref: 'Patient'
    },


})
GuardianToPatientSchema.plugin(timestamp);
const GuardianToPatient = mongoose.model("GuardianToPatient",GuardianToPatientSchema);
module.exports = GuardianToPatient;