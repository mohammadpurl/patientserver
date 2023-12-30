const mongoose = require('mongoose');
const debug = require('debug')("app:main");
const config = require('config');
const dotenv = require("dotenv");
dotenv.config();

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://mohammadpourl:SE8LlSZ55zEy7dzH@cluster0.7tutmup.mongodb.net/patient", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = connectToMongoDB;