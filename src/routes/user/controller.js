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
          
          const email = user?.email;
          const religionId = religion?._id;
          const nationalityId = nationality?._id;
          const sexualityId = sexuality?._id;
          const mStatusId = mStatus?._id;
          const educationId = education?._id;
          const countryId = country?._id;
          
          const userData = {
            id: _id,
            email,
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
            userData.languages = languages
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
    // **********************************getAllGuardian*****************************
    async getAllGuardian(req, res) {
        try {
            const patientId = req.body?.patient
            const guardians = await GuardianToPatient.find({ patient: patientId })
                .populate('guardian', 'email firstName lastName mobileNumber title')
            this.response({ res, data: guardians })
        } catch (error) {
            console.log(`getAllGuardian${error}`);
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
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