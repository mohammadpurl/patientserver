const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true},
    name: {type: String, require: true},
    password: {type: String, require: true},
    isadmin:{type: Boolean, default: false},
    lastRefreshToken:{type: String }


})
UserSchema.plugin(timestamp);
const User = mongoose.model("User",UserSchema);
module.exports = User;