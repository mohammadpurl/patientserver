const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PractitionerToPatientSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.ObjectId, ref: 'User' , require: true
    },
    patientId: {
        type: mongoose.Schema.ObjectId, ref: 'Patient', require: true
    },


})
PractitionerToPatientSchema.plugin(timestamp);
const PractitionerToPatient = mongoose.model("PractitionerToPatient",PractitionerToPatientSchema);
module.exports = PractitionerToPatient;