const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const MenHistorySchema = new mongoose.Schema({
    description: {type: String, require: true},
    code: {type: Number, require: true},
    type: {type: String, require: true}

})
MenHistorySchema.plugin(timestamp);
const MenHistory = mongoose.model("MenHistory",MenHistorySchema);
module.exports = MenHistory;