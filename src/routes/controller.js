const autoBind = require("auto-bind-inheritance");

const { validationResult } = require('express-validator');

const User = require('./../modeles/user')
const Pationt = require('./../modeles/patient')

const Nationality = require('./../modeles/nationality')
const Sexuality = require('./../modeles/Sexuality')
const Language = require('./../modeles/language')
const Religion = require('./../modeles/religion')
const MStatus = require('./../modeles/mstatus')
const Education = require('./../modeles/education')
const Sexualities = require('./../modeles/Sexuality')
const Country = require('./../modeles/country')
const Patient = require('./../modeles/patient')
const Title = require('./../modeles/title');
const Medication = require('./../modeles/medication');
const SymptomsThirty = require('./../modeles/lastThirty');
const WomenHistory = require('./../modeles/womenHistory');
const MedicationToPatient = require('./../modeles/medicationToPatient');
const LastThirtyToPatient = require('./../modeles/lastThirtyToPatient');


module.exports = class{
    constructor(){
        autoBind(this)
        this.User =  User;
        this.Pationt = Pationt;
        this.Nationality = Nationality;
        this.Sexuality = Sexuality;
        this.Language = Language;
        this.Religion = Religion;
        this.MStatus = MStatus;
        this.Education = Education;
        this.Sexualities = Sexualities;
        this.Country = Country;
        this.Patient = Patient;
        this.Title = Title;
        this.Medication = Medication;
        this.SymptomsThirty = SymptomsThirty;
        this.womenHistory = WomenHistory;
        this.MedicationToPatient = MedicationToPatient;
        this.LastThirtyToPatient = LastThirtyToPatient
    }
    validationBody(req,res){
        console.log('validationBody')
        const result = validationResult(req);
        if(!result.isEmpty()){
            const errors = result.array();
            const message = [];
            errors.forEach(err => message.push(err.msg));
            res.status(400).json({
                message: 'validation error',
                data: message
            })
            return false
        }
        return true
    }
    validate(req,res,next){
        console.log("validationBody")
        if(!this.validationBody(req,res)){
            return
        }
        next()
    }
    response({res, message, code=200, data={}}){
        res.status(code).json({
            message,
            data
        })
    }
}