const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const FamilyTypeSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
FamilyTypeSchema.plugin(timestamp);
const FamilyType = mongoose.model("FamilyType",FamilyTypeSchema);
module.exports = FamilyType;