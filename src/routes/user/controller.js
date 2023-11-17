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
            .populate('language', 'name -_id')
            .populate('education', 'name -_id')

        const processedObjects = userInfo?.map(this.processObject);


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
            // const religionId = this.Religion.findOne({code:req.body.religion});
            // const languageId =this.Language.findOne({code:req.body.language});   
            // const nationalityId =this.Nationality.findOne({code:req.body.nationality});   
            // const sexId =this.Sexuality.findOne({code:req.body.sexuality});   
            // const mStatus =this.Language.findOne({code:req.body.mStatus});   
            // const userId = this.User.findOne({email:req.body.email})
            const userId = req.user._id
            console.log("patientRegister")
            let patient = new this.Patient(_.pick(req.body, [
                "firstName",
                "lastName",
                "title",
                "height",
                "weight",
                "mobileNumber",
                "addreess",
                "hoursWorked",
                "religion",
                "nationality",
                "sexuality",
                "mStatus",
                "language",
                "education",
                "occupation",
                "birthDate",
                "address",
                "country",
                
            ]), 
            
            
            );
            patient.user = userId; 
            const response = await patient.save();
            const fullName = `${patient.firstName} ${patient.lastName}`;
            const BMI = patient.weigth / Math.pow(patient.height, 2);
            console.log("BMI" + patient.weigth)
            console.log(Math.pow(patient.height, 2))
            console.log(req.body);
            const age = this._calculateAge(patient.birthDate);

            const respondePatient = { ...req.body, fullName, BMI, age }
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
            .populate('language', 'name code _id')
            .populate('education', 'name  code _id')
            .populate('country', 'name  code _id')

        const userData = {
            "id": userInfo?._id,
            "email": userInfo?.user?.email,
            "firstName": userInfo?.firstName,
            "lastName": userInfo?.lastName,
            "title": userInfo?.title,
            "height": userInfo?.height,
            "weight": userInfo?.weight,
            "mobileNumber": userInfo?.mobileNumber,
            "addreess": userInfo?.addreess,
            "hoursWorked": userInfo?.hoursWorked,
            "religion": userInfo?.religion?._id,
            "nationality": userInfo?.nationality?._id,
            "sexuality": userInfo?.sexuality?._id,
            "mStatus": userInfo?.mStatus?._id,
            "language": userInfo?.language?._id,
            "education": userInfo?.education?._id,
            "occupation": userInfo?.occupation,
            "birthDate": userInfo?.birthDate,
            "country" : userInfo?.country?._id,
            "address" : userInfo?.addreess

        }
        console.log(`userData ${JSON.stringify(userData)}`)
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
            if (isAdmin || id === userId) {
                const updateParams = req.body;

                // Find the document by ID and update it with the new parameters
                const updatedDocument = await this.Pationt.findByIdAndUpdate(id, updateParams, { new: true });

                if (!updatedDocument) {
                    return res.status(404).json({ message: 'Document not found' });
                }

                this.response({ res, data: updatedDocument })
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
    processObject(userInfo) {
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
            "religion": userInfo?.religion?.name,
            "nationality": userInfo?.nationality?.name,
            "sexuality": userInfo?.sexuality?.name,
            "mStatus": userInfo?.mStatus?.name,
            "language": userInfo?.language?.name,
            "education": userInfo?.education?.name,
            "currentOccupatio": userInfo?.currentOccupatio,
            "birthDate": userInfo?.birthDate,


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