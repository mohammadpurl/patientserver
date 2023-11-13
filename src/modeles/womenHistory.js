const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const WomenHistorySchema = new mongoose.Schema({
    description: {type: String, require: true},
    code: {type: Number, require: true},
    type: {type: String, require: true}

})
WomenHistorySchema.plugin(timestamp);
const WomenHistory = mongoose.model("WomenHistory",WomenHistorySchema);
module.exports = WomenHistory;