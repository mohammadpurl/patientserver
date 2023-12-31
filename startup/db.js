const mongoose = require('mongoose');
const debuge = require('debug')("app:main");
const config = require('config');
const dotenv = require("dotenv");
dotenv.config();
module.exports = function(){
    mongoose
    .connect("mongodb+srv://mohammadpourl:SE8LlSZ55zEy7dzH@cluster0.7tutmup.mongodb.net/patient")
    
    .then(() => console.log("connected to mongodb"))
    .catch(() => console.log("could not connect"));
}