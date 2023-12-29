const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const CommentPrToPtSchema = new mongoose.Schema({
    practitionerId: {
        type: mongoose.Schema.ObjectId, ref: 'User' , require: true
    },
    patientId: {
        type: mongoose.Schema.ObjectId, ref: 'Patient', require: true
    },
    comment:{type: String, require: true},


})
CommentPrToPtSchema.plugin(timestamp);
const CommentPrToPt = mongoose.model("CommentPrToPt",CommentPrToPtSchema);
module.exports = CommentPrToPt;