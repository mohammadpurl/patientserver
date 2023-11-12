const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const TitleSchema = new mongoose.Schema({
    name: {type: String, require: true, unique: true},
    code: {type: Number, require: true},
})
TitleSchema.plugin(timestamp);
const Title = mongoose.model("Title",TitleSchema);
module.exports = Title;