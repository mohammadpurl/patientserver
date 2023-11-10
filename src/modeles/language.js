const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const LanguageSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
LanguageSchema.plugin(timestamp);
const Language = mongoose.model("Language",LanguageSchema);
module.exports = Language;