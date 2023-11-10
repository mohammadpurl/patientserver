const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const EducationSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
EducationSchema.plugin(timestamp);
const Education = mongoose.model("Education",EducationSchema);
module.exports = Education;