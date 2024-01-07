const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const FamilyHistorySchema = new mongoose.Schema({
    name: {type: String, require: true},
    code: {type: Number, require: true},
})
FamilyHistorySchema.plugin(timestamp);
const FamilyHistory = mongoose.model("FamilyHistory",FamilyHistorySchema);
module.exports = FamilyHistory;