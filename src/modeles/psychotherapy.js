const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const PsychotherapySchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: String, require: true},
})
PsychotherapySchema.plugin(timestamp);
const Psychotherapy = mongoose.model("Psychotherapy",PsychotherapySchema);
module.exports = Psychotherapy;