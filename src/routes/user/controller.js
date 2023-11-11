const controller = require('./../controller');
const _ = require("lodash");
// const math = require('mathjs');
const jwt = require('jsonwebtoken')

module.exports = new (class extends controller {
    async dashboard(req, res) {

        let users = await this.User.find()
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

            let patient = new this.Patient(_.pick(req.body, [
                "user",
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
            const BMI = patient.weigth / Math.pow(patient,2)
            const respondePatient = { ...patient, fullName, BMI }
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
    // *********************login**********************
    async profile(req, res) {
        this.response({ res, data: _.pick(req.user, ["name", "email"]) })
    }

})();