const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},    
    password: {type: String, require: true},
    isadmin:{type: Boolean, default: false},
    isDoctor:{type: Boolean, default: false},
    conformIsDoctor:{type: Boolean, default: false},
    firstName:{type: String},
    address:{type: String},
    lastName:{type: String},
    religion:{ type: mongoose.Schema.ObjectId, ref: "Religion"},
    nationality:{ type: mongoose.Schema.ObjectId, ref: "Nationality"},
    sexuality:{ type: mongoose.Schema.ObjectId, ref: "Sexuality"},
    mStatus:{ type: mongoose.Schema.ObjectId, ref: "MStatus"},
    languages: [{ type: mongoose.Schema.ObjectId, ref: "Language"}],
    education:{ type: mongoose.Schema.ObjectId, ref: "Education"},
    country:{ type: mongoose.Schema.ObjectId, ref: "Country"},
    title:{ type: mongoose.Schema.ObjectId, ref: "Title"},
    mobileNumber:{type: String},
    birthDate:{type: Date},  
    creatoreId:{ type: mongoose.Schema.ObjectId, ref: 'User'},
    lastRefreshToken:{type: String }


})
UserSchema.plugin(timestamp);
const User = mongoose.model("User",UserSchema);
module.exports = User;