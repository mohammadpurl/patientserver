const controller = require('./../controller');
const Hospital = require('./../../modeles/hospital');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const GuardianToPatient = require('./../../modeles/guardianTopatient');

module.exports = new (class extends controller {
    async getALlPatientList(req, res) {
        console.log("getALlPatientList")
        let userInfo = await this.Patient.find()
            .populate('user', 'email')
            .populate('religion', 'name -_id')
            .populate('nationality', 'name -_id')
            .populate('sexuality', 'name -_id')
            .populate('mStatus', 'name -_id')
            .populate('languages', 'name -_id')
            .populate('education', 'name -_id')

        const processedObjects = userInfo?.map((userInfo)=>this.processObject(userInfo,"show"));



        this.response({
            res, message: "",
            data: processedObjects
        });
    }
    // *********************Get all Doctors**********************
    async getALlDoctors(req, res) {
        try {
            console.log("getALlDoctorsList")
            let userInfo = await this.User.find({ isDoctor: true })
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

    // *********************Register patients**********************
    async patientRegister(req, res) {
        try {

            const userId = req.user._id
            console.log("patientRegister")
            let patient = new this.Patient(_.pick(req.body, [
                "sexuality",
                "title",
                "firstName",
                "lastName",
                "address",
                "country",
                "mobileNumber",
                "nationality",
                "religion",
                "mStatus",
                "education",
                "languages",
                "occupation",
                "height",
                "weight",
                "hoursWorked",

                "birthDate"

            ]),


            );
            patient.user = userId;
            const response = await patient.save();
            console.log(`patient register ${response}`)           
            const respondePatient =  this.processObject(response)
            this.response({
                res, message: "the user successfully registered",
                data: respondePatient
                //  _.pick(response, ["_id"]

            });
        } catch (error) {

            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }

    }

    // *********************prifile**********************
    async profile(req, res) {
        console.log(`req.user${req.user}`)
        let userInfo = await this.Patient.findOne({ user: req.user._id })
            .populate('user', 'email')
        const userData = {
            "email": userInfo?.user?.email,
            "firstName": userInfo?.firstName,
            "lastName": userInfo?.lastName
        }

        console.log(`userData:${JSON.stringify(userInfo)}`)
        this.response({ res, data: userData })
    }

    // *********************patientDeatil**********************
    async patientDetail(req, res) {
        console.log(`lmp${req.user}`)
        const userId = req.params.id;
        let userInfo = await this.Patient.findOne({ _id: userId })
            .populate('user', 'email')
            .populate('religion', 'name code _id')
            .populate('nationality', 'name code _id')
            .populate('sexuality', 'name code _id')
            .populate('mStatus', 'name code _id')
            .populate('languages', 'name code _id')
            .populate('education', 'name  code _id')
            .populate('country', 'name  code _id')
        // console.log(`patientDetail:userInfo${userInfo}`)
       const userData = this.processObject(userInfo)
        this.response({
            res, message: "",
            data: userData
        });

    }

    //********************************patientUpdate************************************ */
    async patientUpdate(req, res) {
        try {
            const isAdmin = req.userData.isAdmin
            const userId = req.userData._id
            const id = req.params.id;
            // if (isAdmin || id === userId) {
                const updateParams = req.body;

                // Find the document by ID and update it with the new parameters
                const updatedDocument = await this.Pationt.findByIdAndUpdate(id, updateParams);
                const userInfo = await this.Patient.findOne({ _id: id })
                const userData = this.processObject(userInfo)
                console.log(`patientUpdate${updatedDocument}`)
                if (!updatedDocument) {
                    return res.status(404).json({ message: 'Document not found' });
                }

                this.response({ res, data: userData })
            // }


        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    // *******************************************calculate age
    _calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday?.getTime();
        console.log(`ageDifMs${ageDifMs}`);
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    // ****************************************get user info
    processObject(userInfo, type) {

        const fullName = `${userInfo.firstName} ${userInfo.lastName}`;
        const BMI = userInfo.weight / Math.pow(userInfo.height, 2);
        console.log("BMI" + BMI)
        console.log(Math.pow(userInfo.height, 2))
        const age = this._calculateAge(userInfo.birthDate);
        const languages = []
        userInfo?.languages.map((language) => languages.push(language._id))

        const userData = {
            "id": userInfo?._id,
            "email": userInfo?.user?.email,
            "firstName": userInfo?.firstName,
            "lastName": userInfo?.lastName,
            "title": userInfo?.title,
            "height": userInfo?.height,
            "weight": userInfo?.weigth,
            "mobileNumber": userInfo?.mobileNumber,
            "addreess": userInfo?.addreess,
            "hoursWorked": userInfo?.hoursWorked,
            "currentOccupatio": userInfo?.currentOccupatio,
            "birthDate": userInfo?.birthDate,
            "religion": userInfo?.religion?._id,
            "nationality": userInfo?.nationality?._id,
            "sexuality": userInfo?.sexuality?._id,
            "mStatus": userInfo?.mStatus?._id,
            "education": userInfo?.education?._id,
            "age": age,
            "BMI": BMI,
            "languages": languages,
            "fullName": fullName,
            "languages": languages

        }
        console.log(`processObject userData ${JSON.stringify(userData) }`)
        if (type && type == "show") {
            const languages = []
            userInfo?.languages.map((language) => {
                console.log(`processObject${language.name}`)
                languages.push(language.name)
            })

            userData.religion = userInfo?.religion?.name;
            userData.nationality = userInfo?.nationality?.name;
            userData.sexuality = userInfo?.sexuality?.name;
            userData.mStatus = userInfo?.mStatus?.name;
            userData.education = userInfo?.education?.name;
            userData.languages =languages
        }
        return userData
    }
    // ************************************insert Doctor or Guardian
    async registerDoctorOrGuardian(req, res) {

        try {
            console.log("registerDoctorOrGuardian")
            const gOrD = new this.User(_.pick(req.body, ["isDoctor"]));
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