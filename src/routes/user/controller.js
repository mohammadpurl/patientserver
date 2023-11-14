const controller = require('./../controller');
const Hospital = require('./../../modeles/hospital');
const _ = require("lodash");
// const math = require('mathjs');
const jwt = require('jsonwebtoken')

module.exports = new (class extends controller {
    async getALlPatientList(req, res) {

        let users = await this.Patient.find()
                          .populate('User', 'email')
                          .populate('Religion','name -_id')
                          .populate('Nationality','name -_id')
                          .populate('Sexuality','name -_id')
                          .populate('MStatus','name -_id')
                          .populate('Language','name -_id')
                          .populate('Education','name -_id')



        this.response({
            res, message: "",
            data: users
        });
    }
    // *********************Register patients**********************
    async patientRegister(req, res) {
        try {
            // const religionId = this.Religion.findOne({code:req.body.religion});
            // const languageId =this.Language.findOne({code:req.body.language});   
            // const nationalityId =this.Nationality.findOne({code:req.body.nationality});   
            // const sexId =this.Sexuality.findOne({code:req.body.sexuality});   
            // const mStatus =this.Language.findOne({code:req.body.mStatus});   
            // const userId = this.User.findOne({email:req.body.email})
            console.log("patientRegister")
            let patient = new this.Patient(_.pick(req.body, [
                "User",
                "firstName",
                "lastName",
                "title",
                "height",
                "weigth",
                "mobileNumber",
                "addreess",
                "hoursWorked",
                "Religion",
                "Nationality",
                "Sexuality",
                "MStatus",
                "Language",
                "Education",
                "currentOccupatio",
                "birthDate",

            ]));

            const response = await patient.save();
            const fullName = `${patient.firstName} ${patient.lastName}`;
            const BMI = patient.weigth / Math.pow(patient.height,2);
            console.log("BMI"+patient.weigth)
            console.log(Math.pow(patient.height,2))
            console.log(req.body);
            const age = _calculateAge(patient.birthDate);
            
            const respondePatient = { ...req.body, fullName, BMI, age }
            this.response({
                res, message: "the user successfully registered",
                data:respondePatient
                //  _.pick(response, ["_id"]
                 
            });
        } catch (error) {

            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }

    }
    // *********************Register Hospital**********************
    async hospitalRegister(req, res) {
        try {
            
            console.log("hospital Register")
            let hospital = new Hospital(_.pick(req.body, [
                "Country",
                "name"
                

            ]));

            const response = await hospital.save();
           
            
            this.response({
                res, message: "the hospital successfully registered",
                data: _.pick(response, ["_id"])
                 
            });
        } catch (error) {

            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }

    }
    // *********************login**********************
    async profile(req, res) {
        console.log(`req.user${req.user}`)
        let userInfo = await this.Patient.findOne({User:req.user._id})
        .populate('User', 'email')
        const userData ={       
            "email": userInfo?.User?.email,
            "firstName": userInfo?.firstName,
            "lastName": userInfo?.lastName
        }
        
        console.log(`userData:${JSON.stringify(userInfo)}`)
        this.response({ res, data:userData  })
    }




     _calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

})();