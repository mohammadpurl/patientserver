const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const GuardianSchema = new mongoose.Schema({
    
    
    email:{type: String, require: true, unique: true},
    password:{type: String, require: true, unique: true},
    
   
})
GuardianSchema.plugin(timestamp);
const Guardian = mongoose.model("Guardian",GuardianSchema);
module.exports = Guardian;

