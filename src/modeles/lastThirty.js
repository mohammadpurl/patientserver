const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const SymptomsThirtySchema = new mongoose.Schema({
    id: {type: Number, require: true, unique: true},
    name: {type: String, require: true, },    
    parentID: {type: Number, require: false},
})
SymptomsThirtySchema.plugin(timestamp);
const SymptomsThirty = mongoose.model("SymptomsThirty",SymptomsThirtySchema);
module.exports = SymptomsThirty;