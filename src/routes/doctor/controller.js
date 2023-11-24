const controller = require('./../controller');
const Hospital = require('./../../modeles/hospital');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const GuardianToPatient = require('./../../modeles/guardianTopatient');

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
    async registerDoctor(req, res) {

        try {
            console.log("registerDoctor")
            
            let id = await this.saveGuardianorDoctorInDB(req, res);
            const isDoctor = gOrD.isDoctor
            console.log(`isDoctor${isDoctor}`)
            if (id === 1) {
                this.response({
                    res, message: "the user successfully registered",
                    data: _.pick(req.body, ["email"])
                });
            }
            if (isDoctor) {
                this.response({
                    res, message: " successfully registered",
                    data: id
                });
            }
            else {

                req.body.guardianId = id;

                const gToP = await this.guardianToPatient(req, id)

                console.log(`isDoctor == false `)
                if (gToP === -1) {
                    return res.status(500).json({ status: false, message: "something went wrong", data: error });

                }
                else {
                    this.response({
                        res, message: " successfully gto registered",
                        data: id
                    });
                }


            }


        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }

    }
    //********************************patientUpdate************************************ */
    async saveGuardianorDoctorInDB(req) {
        try {
            console.log("saveGuardianorDoctorInDB")
            let user = await this.User.findOne({ email: req.body.email })
            if (user) {
                return 1
            }
            const creatorId = req.userData._id
            user = new this.User(_.pick(req.body, ["email", "password", "isDoctor", "firstName", "lastName", "title", "mobileNumber"]));
            user.creatoreId = creatorId;
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            const response = await user.save();
            console.log(`saveGuardianorDoctorInDB${response}`)
            const id = _.pick(user, ["_id"])
            console.log("finish saveGuardianorDoctorInDB")
            return id
        } catch (error) {
            console.log(`saveGuardianorDoctorInDB LMP:${error}`)
            // return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    // ************************************Guardian to Patient
    async guardianToPatient(req, guardianId) {

        try {
            console.log('guardianToPatient')
            let guardianToPatient = new GuardianToPatient();
            guardianToPatient.guardian = guardianId;
            guardianToPatient.patient = req.userData._id

            const response = await guardianToPatient.save();
            return response._id
        } catch (error) {
            console.log(` lmp    guardianToPatient ${error}`)
            return -1
            // return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    // ************************InsertMedicationToPatient****************************
    async InsertMedicationToPatient(req, res) {
        try {
            console.log("InsertMedicationToPatient")
            const medicationList = req.body?.medicationList;
            console.log(`medicationList${JSON.stringify(medicationList)}`)

            const patientId = req.user?._id
            console.log(`patientId${patientId}`)
            for (var i = 0; i < medicationList.length; i++) {
                console.log("medication" + medicationList[i].howManydays)
                let medicationToPatient = new this.MedicationToPatient();
                medicationToPatient.drugStrength = medicationList[i].drugStrength;
                medicationToPatient.dosePerDay = medicationList[i].dosePerDay;
                medicationToPatient.patientId = patientId;
                medicationToPatient.medicationId = medicationList[i].medicationId;
                medicationToPatient.howManydays = medicationList[i].howManydays;

                const response = await medicationToPatient.save();
                console.log(`medicationList response${JSON.stringify(response)}`)
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
     // ************************InsertMedicalHisToPatient****************************
     async InsertMedicalHisToPatient(req, res) {
        try {
            console.log("InsertMedicalHisToPatient")
            const medicalHisList = req.body?.medicalHisList;
            console.log(`medicalHisList${JSON.stringify(medicalHisList)}`)

            const patientId = req.user?._id
            console.log(`patientId${patientId}`)
            for (var i = 0; i < medicalHisList.length; i++) {
                console.log("medication" + medicalHisList[i].value)
                let medicalHisToPatient = new this.medicalHisToPatient();
                medicalHisToPatient.medicalHisId = medicalHisList[i].medicalHisId;
                medicalHisToPatient.value = medicalHisList[i].value;
                medicalHisToPatient.patientId = patientId;

                const response = await medicalHisToPatient.save();
                console.log(`medicalHisToPatient response${JSON.stringify(response)}`)
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // ************************InsertMedicationToPatient****************************
    async InsertLastThirtyToPatient(req, res) {
        try {
            console.log("InsertLastThirtyToPatient")
            const lastThirtyList = req.body?.lastThirtyList;
            console.log(`lastThirtyList${JSON.stringify(lastThirtyList)}`)

            const patientId = req.user?._id
            console.log(`patientId${patientId}`)
            for (var i = 0; i < lastThirtyList.length; i++) {
                console.log("lastThirty" + lastThirtyList[i].lastThirtyItem)
                let lastThirtyToPatient = new this.LastThirtyToPatient();
                lastThirtyToPatient.lastThirtyItem = lastThirtyList[i].lastThirtyItem;
                lastThirtyToPatient.value = lastThirtyList[i].value;
                lastThirtyToPatient.patientId = patientId;

                const response = await lastThirtyToPatient.save();
                console.log(`lastThirtyList response${JSON.stringify(response)}`)
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

})();