const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const HurtAreaSchema = new mongoose.Schema({
    areaName: {type: String, require: true},
    rate: {type: Number, require: true},
    patientId: {
        type: mongoose.Schema.ObjectId, ref: 'Patient', require: true
    },
    hurtTypeId: {
        type: mongoose.Schema.ObjectId, ref: 'HurtType', require: true
    },
    isFront :{type:Boolean, require: true}

})
HurtAreaSchema.plugin(timestamp);
const HurtArea = mongoose.model("HurtArea",HurtAreaSchema);
module.exports = HurtArea;