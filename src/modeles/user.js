const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},    
    password: {type: String, require: true},
    isadmin:{type: Boolean, default: false},
    isDoctor:{type: Boolean, default: false},
    conformIsDoctor:{type: Boolean, default: false},
    firstName:{type: String},
    lastName:{type: String},
    title:{ type: mongoose.Schema.ObjectId, ref: "Title"},
    mobileNumber:{type: String},
    birthDate:{type: Date},  
    creatoreId:{ type: mongoose.Schema.ObjectId, ref: 'User'},
    lastRefreshToken:{type: String }


})
UserSchema.plugin(timestamp);
const User = mongoose.model("User",UserSchema);
module.exports = User;