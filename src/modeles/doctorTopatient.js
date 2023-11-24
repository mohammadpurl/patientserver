const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const DoctorToPatientSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.ObjectId, ref: 'User' , require: true
    },
    patientId: {
        type: mongoose.Schema.ObjectId, ref: 'Patient', require: true
    },


})
DoctorToPatientSchema.plugin(timestamp);
const DoctorToPatient = mongoose.model("DoctorToPatient",DoctorToPatientSchema);
module.exports = DoctorToPatient;