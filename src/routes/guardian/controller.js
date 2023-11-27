const controller = require('./../controller');
const Hospital = require('./../../modeles/hospital');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const GuardianToPatient = require('./../../modeles/guardianTopatient');
const { json } = require('stream/consumers');

module.exports = new (class extends controller {
    // ************************************insert  Guardian
    async registerGuardian(req, res) {
        try {
            console.log("registerGuardian")
            let id = await this.saveGuardianInDB(req, res);
            req.body.guardianId = id;
            const gToP = await this.guardianToPatient(req, id)
            if (gToP === -1) {
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
    //********************************saveGuardianInDB************************************ */
    async saveGuardianInDB(req) {
        try {
            console.log("saveGuardianInDB")
            let user = await this.User.findOne({ email: req.body.email })
            if (!user) {
                user = new this.User(_.pick(req.body, ["email", "password", "isDoctor", "firstName", "lastName", "title", "mobileNumber"]));
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.mobileNumber, salt);
                const response = await user.save();
                console.log(`saveGuardianoInDB${response}`)
            }
            const creatorId = req.userData._id
            user.creatoreId = creatorId;

            const id = _.pick(user, ["_id"])
            console.log("finish saveGuardianoInDB")
            return id
        } catch (error) {
            console.log(`saveGuardianoInDB LMP:${error}`)

        }
    }
    // ************************************Guardian to Patient
    async guardianToPatient(req, guardianId) {

        try {
            console.log('guardianToPatient')
            let guardianToPatient = new this.GuardianToPatient();
            guardianToPatient.guardian = guardianId;
            guardianToPatient.patient = req.user._id

            const response = await guardianToPatient.save();
            return response._id
        } catch (error) {
            console.log(` lmp    guardianToPatient ${error}`)
            return -1
            // return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    // **********************************getAllGuardian*****************************
    async getAllGuardian(req, res) {
        try {
            const patientId = req.params.id
            const guardians = await this.GuardianToPatient.find({ patient: patientId })
                .populate('guardian', 'email firstName lastName mobileNumber title')
            this.response({ res, data: guardians })
        } catch (error) {
            console.log(`getAllGuardian${error}`);
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }

})();