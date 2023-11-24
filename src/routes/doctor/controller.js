const controller = require('./../controller');
const Hospital = require('./../../modeles/hospital');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const GuardianToPatient = require('./../../modeles/guardianTopatient');
const { json } = require('stream/consumers');

module.exports = new (class extends controller {
    // *********************Get all Doctors**********************
    async getALlDoctors(req, res) {
        try {
            console.log("getALlDoctorsList")
            let userInfo = await this.User.find({ isDoctor: true, conformIsDoctor: true })
            console.log(`userInfo:${userInfo}`)
            this.response({
                res, message: "",
                data: userInfo
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }

    // ************************************insert Doctor or Guardian
    async registerPractitioner(req, res) {

        try {
            console.log("registerDoctor")

            let id = await this.savePractitionerInDB(req, res);
            req.body.practitionerId = id;

            const dToP = await this.practitionerToPatient(req, id)
           
            if (dToP === -1) {
                return res.status(500).json({ status: false, message: "something went wrong", data: error });

            }
            else {
                this.response({
                    res, message: " successfully gto registered",
                    data: id
                });
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }

    }
    //********************************patientUpdate************************************ */
    async savePractitionerInDB(req) {
        try {
            console.log("savePractitionerInDB")
            let user = await this.User.findOne({ email: req.body.email })
            if (user) {
                return user._id
            }
            const creatorId = req.userData._id
            user = new this.User(_.pick(req.body, ["email", "password", "isDoctor", "firstName", "lastName", "title", "mobileNumber"]));
            user.creatoreId = creatorId;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.mobileNumber, salt);
            const response = await user.save();
            console.log(`savePractitionerInDB rsponse${response}`)
            const id = _.pick(user, ["_id"])
            console.log("finish savePractitionerInDB")
            return id
        } catch (error) {
            console.log(`savePractitionerInDB LMP:${error}`)
            // return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    // ************************************Guardian to Patient
    async practitionerToPatient(req, practitionerId) {

        try {
            console.log('practitionerToPatient')
            let practitionerToPatient = new this.PractitionerToPatient();
            practitionerToPatient.practitionerId = practitionerId;
            practitionerToPatient.patientId = req.body.patientId

            const response = await practitionerToPatient.save();
            return response._id
        } catch (error) {
            console.log(` lmp practitionerToPatient ${error}`)
            return -1
            // return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    // ************************InsertMedicationToPatient****************************
    async relatedPractitionerToPatient(req, res){
        try {
            console.log('relatedPractitionerToPatient')
            const patientId = req.params?.id;
            let practitionerInfo = await this.PractitionerToPatient.find({ patientId: patientId })
            .populate('practitionerId', 'email firstName lastName  mobileNumber isDoctor conformIsDoctor _id')
           
            console.log(`relatedPractitionerToPatient response ${JSON.stringify(practitionerInfo)}`)
            this.response({
                res, message: "",
                data: practitionerInfo
            });

            
        } catch (error) {
            console.log(` lmp practitionerToPatient ${error}`)          
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    

})();