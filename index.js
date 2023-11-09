const express = require('express');

const app = express();

const mongoose = require('mongoose');
const debuge = require('debug')("app:main");
const config = require('config');
const dotenv = require("dotenv");
dotenv.config();

const router = require('./src/routes')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose
    .connect("mongodb+srv://mohammadpourl:SE8LlSZ55zEy7dzH@cluster0.7tutmup.mongodb.net/patient")
    
    .then(() => console.log("connected to mongodb"))
    .catch(() => console.log("could not connect"));


app.use('/api', router);

   

const PORT = process.env.PORT  || 5000;
app.listen(PORT , () => console.log(`listening on port ${PORT}`));

