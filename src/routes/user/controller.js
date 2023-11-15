const controller = require('./../controller');
const Hospital = require('./../../modeles/hospital');
const _ = require("lodash");
// const math = require('mathjs');
const jwt = require('jsonwebtoken')

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
                "user",
                "firstName",
                "lastName",
                "title",
                "height",
                "weigth",
                "mobileNumber",
                "addreess",
                "hoursWorked",
                "religion",
                "nationality",
                "sexuality",
                "mStatus",
                "language",
                "education",
                "currentOccupatio",
                "birthDate",

            ]));

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
        console.log(`req.user${req.user}`)
        const userId = req.params.id;
        let userInfo = await this.Patient.findOne({ _id: userId })
            .populate('user', 'email')            
            .populate('religion', 'name -_id')
            .populate('nationality', 'name -_id')
            .populate('sexuality', 'name -_id')
            .populate('mStatus', 'name -_id')
            .populate('language', 'name -_id')
            .populate('education', 'name -_id')

        // const userData = this.processObject(userInfo);
        console.log(`userData ${JSON.stringify(userInfo) }`)
        this.response({
            res, message: "",
            data: userData
        });

    }

    //******************************************************************** */
    async patientUpdate(req,res){
        try {
            const isAdmin = req.userData.isAdmin
             
            const userId = req.params.id;
            const updateParams = req.body; 
        
            // Find the document by ID and update it with the new parameters
            const updatedDocument = await this.Pationt.findByIdAndUpdate(userId, updateParams, { new: true });
        
            if (!updatedDocument) {
              return res.status(404).json({ message: 'Document not found' });
            }
        
            this.response({ res, data: updatedDocument })
            
          } catch (error) {
            console.log(error)
            return res.status(500).json({ status: false, message: "something went wrong", data: error });
          }
    }
    _calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday?.getTime();
        console.log(`ageDifMs${ageDifMs}`);
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    processObject(userInfo) {
        const userData = {
            "id": userInfo?._id,
            "email": userInfo?.user?.email,
            "firstName": userInfo?.firstName,
            "lastName": userInfo?.lastName,
            "title": userInfo?.title,
            "height": userInfo?.height,
            "weigth": userInfo?.weigth,
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
            "birthDate": userInfo?.birthDate

        }
        return userData
    }
})();