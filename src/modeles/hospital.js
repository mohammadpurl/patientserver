const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const HospitalSchema = new mongoose.Schema({
    
    
    name:{type: String, require: true,},   
    country:{ type: mongoose.Schema.ObjectId, ref: "Country"},
    
   
})
HospitalSchema.plugin(timestamp);
const Hospital = mongoose.model("Hospital",HospitalSchema);
module.exports = Hospital;

