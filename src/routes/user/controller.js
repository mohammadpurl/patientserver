const controller = require('./../controller');
const Hospital = require('./../../modeles/hospital');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');


module.exports = new (class extends controller {
    //get all visit list for a patient
    async getALlPatientList(req, res) {
        console.log("getALlPatientList")

        let userInfo = await this.Patient.find({ user: req.user._id })
            .populate('user', 'email')
            .populate('religion', 'name -_id')
            .populate('nationality', 'name -_id')
            .populate('sexuality', 'name -_id')
            .populate('mStatus', 'name -_id')
            .populate('languages', 'name -_id')
            .populate('education', 'name -_id')
            .populate('title', 'name -_id')
            .populate('country', 'name  code _id')


        const processedObjects = userInfo?.map((userInfo) => this.processObject(userInfo, "show"));
        this.response({
            res, message: "",
            data: processedObjects
        });
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
            const respondePatient = this.processObject(response)
            this.response({
                res, message: "the user successfully registered",
                data: respondePatient

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
        const patientId = req.params.id

        let userInfo = await this.Patient.findOne({ _id: patientId })
            .populate('user', 'email')
            .populate('religion', 'name code _id')
            .populate('nationality', 'name code _id')
            .populate('sexuality', 'name code _id')
            .populate('mStatus', 'name code _id')
            .populate('languages', 'name code _id')
            .populate('education', 'name  code _id')
            .populate('country', 'name  code _id')
            .populate('title', 'name -_id')

        console.log(`patientDetail userInfo: ${userInfo}`)
        if (userInfo) {
            const userData = this.processObject(userInfo)
            this.response({
                res, message: "",
                data: userData
            });
        }
        else {
            this.response({
                res, message: "",
                data: {}
            });
        }
    }

    //********************************patientUpdate************************************ */
    async patientUpdate(req, res) {       

        try {
            // const isAdmin = req.user.isadmin

            // const hasAccess = this.checkAccess(req, res);
            // TODO must check access
            const hasAccess = true
            if (!hasAccess) {
                console.log(`hasAccess = ${hasAccess}`)
                return res.status(403).json({ status: false, message: "Access denied", data: {} });
            }

            const pationtId = req.params.id;

            const updateParams = req.body;

            // Find the document by ID and update it with the new parameters
            const updatedDocument = await this.Pationt.findByIdAndUpdate(pationtId, updateParams);
            const id = _.pick(updatedDocument, ["_id"])
            const patientInfo = await this.Patient.findOne({ _id: id })
            const patientData = this.processObject(patientInfo)
            console.log(`patientUpdate${JSON.stringify(patientInfo)}`)
            if (!updatedDocument) {
                return res.status(404).json({ message: 'Document not found' });
            }
            else {

                console.log(patientData)
                this.response({ res, data: patientData })

            }
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

        const {
            _id,
            user,
            firstName,
            lastName,
            title,
            height,
            weight,
            mobileNumber,
            address,
            hoursWorked,
            occupation,
            birthDate,
            religion,
            nationality,
            sexuality,
            mStatus,
            education,
            country
        } = userInfo;
        console.log(`processObject userInfo:${userInfo}`)
        const email = user?.email;
        const religionId = religion?._id;
        const nationalityId = nationality?._id;
        const sexualityId = sexuality?._id;
        const mStatusId = mStatus?._id;
        const educationId = education?._id;
        const countryId = country?._id;
        const titleId = title?._id;
        const fullName = `${firstName} ${lastName}`;
        const BMI = weight / Math.pow(height, 2);
        console.log("BMI" + BMI)
        console.log(Math.pow(height, 2))
        const age = this._calculateAge(birthDate);
        const languages = []
        userInfo?.languages?.map((language) => languages.push(language._id))

        const userData = {
            id: _id,
            email,
            firstName,
            lastName,
            title: titleId,
            height,
            weight,
            mobileNumber,
            address,
            hoursWorked,
            occupation,
            birthDate,
            religion: religionId,
            nationality: nationalityId,
            sexuality: sexualityId,
            mStatus: mStatusId,
            education: educationId,
            age,
            BMI,
            languages,
            fullName,
            country: countryId
        };
        console.log(`processObject userData ${JSON.stringify(userData)}`)
        if (type && type == "show") {
            const languages = []
            languages.map((language) => {
                console.log(`processObject${language.name}`)
                languages.push(language.name)
            })

            userData.religion = religion?.name;
            userData.nationality = nationality?.name;
            userData.sexuality = sexuality?.name;
            userData.mStatus = mStatus?.name;
            userData.education = education?.name;
            userData.languages = languages;
            userData.title = title?.name
        }
        return userData
    }
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
    // ************************InsertMedicationToPatient****************************
    async insertMedicationToPatient(req, res) {
        try {
            console.log("InsertMedicationToPatient")
            const medicationList = req.body?.medicationList;
            console.log(`medicationList${JSON.stringify(medicationList)}`)

            const patientId = req.body?.patientId
            console.log(`patientId${patientId}`)
            for (var i = 0; i < medicationList.length; i++) {
                console.log("medication" + medicationList[i].howManydays)
                let medicationToPatient = new this.MedicationToPatient();
                medicationToPatient.drugStrength = medicationList[i].drugStrength;
                medicationToPatient.dosePerDay = medicationList[i].dosePerDay;
                medicationToPatient.patientId = patientId;
                medicationToPatient.medicationId = medicationList[i].medicationId;
                medicationToPatient.howManydays = medicationList[i].howManydays;
                const hasMedicationValue = await this.MedicationToPatient.find({ patientId: patientId, medicationId: medicationList[i].medicationId })
                if (!hasMedicationValue) {
                    console.log('!hasMedicationValue')
                    const response = await medicationToPatient.save();
                    console.log(`medicationList response${JSON.stringify(response)}`)
                }
                else{
                    console.log('hasMedicationValue')

                    const resp = await this.MedicationToPatient.findOneAndDelete({patientId:patientId, medicationId: medicationList[i].medicationId })
                    const response = await medicationToPatient.save();
                    console.log(`medicationList in else response${JSON.stringify(response)}`)
                }

            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // **********************************getAllGuardian*****************************
    async getAllMedication(req, res) {
        try {
            const patientId = req.params?.id
            console.log(`getAllMedication patientId ${patientId}`)
            const medication = await this.MedicationToPatient.find({ patientId: patientId })
                .populate('medicationId', 'name code')
            this.response({ res, data: medication })
        } catch (error) {
            console.log(`Medication${error}`);
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }

    // ************************InsertMedicalHisToPatient****************************
    async insertMedicalHisToPatient(req, res) {
        try {
            console.log(req.body)
            const medicalHisList = req.body?.medicalHisList;
            console.log(`medicalHisList${JSON.stringify(medicalHisList)}`)

            const patientId = req.body?.patientId
            console.log(`patientId ${patientId}`)
            for (var i = 0; i < medicalHisList?.length; i++) {
                console.log("medicalHisList" + medicalHisList[i].value)
                let medicalHisToPatient = new this.medicalHisToPatient();
                medicalHisToPatient.medicalHisId = medicalHisList[i].medicalHisId;
                medicalHisToPatient.value = medicalHisList[i].value;
                medicalHisToPatient.patientId = patientId;
                const hasHistory = await this.medicalHisToPatient.find({ patientId: patientId, medicalHisId: medicalHisList[i].medicalHisId })
                if (!hasHistory) {
                    const response = await medicalHisToPatient.save();
                    console.log(`medicalHisToPatient response${JSON.stringify(response)}`)
                }
                else{
                    console.log('hasmedicalHisToPatient')
                    
                    const resp = await this.medicalHisToPatient.findOneAndDelete({patientId:patientId, medicalHisId: medicalHisList[i].medicalHisId })
                    const response = await medicalHisToPatient.save();
                    console.log(`medicalHisToPatient in else response${JSON.stringify(response)}`)
                }
               

            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // **********************************getAllMedicalHistory*****************************
    async getAllMedicalHistory(req, res) {
        try {
            const patientId = req.body?.patientId
            const medicalHisory = await this.medicalHisToPatient.find({ patientId: patientId })
                .populate('medicalHisId', 'name code')
            this.response({ res, data: medicalHisory })
        } catch (error) {
            console.log(`medicalHisory${error}`);
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }
    // ************************InsertMedicationToPatient****************************
    async insertLastThirtyToPatient(req, res) {
        try {
            console.log("InsertLastThirtyToPatient")
            const lastThirtyList = req.body?.lastThirtyList;
            console.log(`lastThirtyList${JSON.stringify(lastThirtyList)}`)

            const patientId = req.body?.patientId._id
            console.log(`patientId${patientId}`)
            for (var i = 0; i < lastThirtyList.length; i++) {
                console.log("lastThirty" + lastThirtyList[i].lastThirtyItem)
                let lastThirtyToPatient = new this.LastThirtyToPatient();
                lastThirtyToPatient.lastThirtyId = lastThirtyList[i].lastThirtyItem;
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
    // **********************************getAllMedicalHistory*****************************
    async getAllLastThirty(req, res) {
        try {
            const patientId = req.body?.patientId
            const lastThirtyToPatient = await this.LastThirtyToPatient.find({ patientId: patientId })
                .populate('lastThirtyId', 'name code')
            this.response({ res, data: lastThirtyToPatient })
        } catch (error) {
            console.log(`medicalHisory${error}`);
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }

    // *******************************************check access
    checkAccess(req, res, next) {
        try {

            userId = req.user._id
            req.params.id = userId
            const hasAccess = false
            if (req.gRelatedPatientList.includes(userId) || req.dRelatedPatientList.includes(userId) || userId == req.user._id) {
                hasAccess = true
            }
            if (hasAccess) {
                return true;
            }
            else {
                return false
            }
        } catch (error) {
            console.log(error)
            // return res.status(500).json({ status: false, message: "something went wrong", data: error });
        }
    }

})();