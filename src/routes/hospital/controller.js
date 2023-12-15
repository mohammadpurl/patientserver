const controller = require("./../controller");
const Hospital = require("./../../modeles/hospital");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const GuardianToPatient = require("./../../modeles/guardianTopatient");
const email = require("./../mail");
const { json } = require("stream/consumers");
const { default: mongoose } = require("mongoose");

module.exports = new (class extends controller {
  // *********************Get all Doctors**********************
  async getAllHospital(req, res) {
    try {
     
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }

  // ************************************register hospital ************************************
  async registerHospital(req, res) {
    try {   
      console.log("registerHospital")   
      let hospital = await this.Hospital.findOne({ name: req.body.name, country:req.body.country });
      console.log(hospital)
      if(!hospital){
          hospital = new this.Hospital(
            {
              name:req.body.name,
              country:req.body.country,
            }
          )        
          const response = await hospital.save();
          this.response({
            res, message: "the hospital successfully registered",
            data: response
        });
      }
      else{
        this.response({
          res, message: "this hospital already registered",
          data: response
      });
      }
      
        
      }     
     catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  //********************************patientUpdate************************************ */
  async savePractitionerInDB(newPractitioner, req, res) {
    try {
     
      let user = await this.User.findOne({ email: newPractitioner?.email });
      console.log(`savePractitionerInDB user  ${user}`);
      if (user) {
        return user._id;
      }      

      const salt = await bcrypt.genSalt(10);
      newPractitioner.password = await bcrypt.hash(
        newPractitioner.mobileNumber,
        salt
      );
      const response = await newPractitioner.save();
      console.log(`savePractitionerInDB rsponse${response}`);
      const id = _.pick(response, ["_id"]);
      console.log("finish savePractitionerInDB");
      return id;
    } catch (error) {
      console.log(`savePractitionerInDB LMP:${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ************************************Guardian to Patient
  async practitionerToPatient(req, practitionerId) {
    try {
      console.log("practitionerToPatient");
      const patientId = req.body.patientId;
      const practitionertopatient = await this.PractitionerToPatient.findOne({
        practitionerId: practitionerId,
        patientId: patientId,
      });
      
      console.log(`practitionerInfo is: ${practitionertopatient}`);
     
      if (practitionertopatient) {
        console.log(`practitionertopatient._id ${practitionertopatient}`);
        return practitionertopatient._id;
      }
      let practitionerToPatient = new this.PractitionerToPatient({
        practitionerId,
        patientId,
      });

      const response = await practitionerToPatient.save();
      console.log("req is");
      

      this.sendEmailToPractitioners(req, practitionerId)
      return response._id;
    } catch (error) {
      console.log(` lmp practitionerToPatient ${error}`);
      return -1;
    }
  }
  // ************************send Email for practitioner****************************
  async sendEmailToPractitioners(req,practitionerId) {
    console.log("sendEmailToPractitioners")
    const patientId = req.body.patientId;
    let patientInfo = await this.Patient.findOne({ _id: patientId })
                          .populate('user', 'email firstName lastName')
    const patientName = `${patientInfo.firstName} ${patientInfo.lastName}`
    console.log(patientInfo) 
    let practitionerInfo = await this.User.findOne({ _id: practitionerId })


    const doctorName = `${practitionerInfo.firstName} ${practitionerInfo.lastName}`    
    
    email.sendMailToPractitioners(practitionerInfo?.email, patientName, doctorName,"practitioner")
    // email.sendMail(req.body.email)

  }

  // ************************InsertMedicationToPatient****************************
  async relatedPractitionerToPatient(req, res) {
    try {
      console.log("relatedPractitionerToPatient");
      const patientId = req.params?.id;
      const isValid = await this.validatePatientId(patientId);
      // console.log(`relatedPractitionerToPatient ${isValid}`)
      let practitionerInfo = await this.PractitionerToPatient.find({
        patientId: patientId,
      }).populate(
        "practitionerId",
        "email firstName lastName  mobileNumber isDoctor conformIsDoctor _id"
      );

      this.response({
        res,
        message: "",
        data: practitionerInfo,
      });
    } catch (error) {
      console.log(` lmp practitionerToPatient ${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  async deleterelatedPractitioner(req, res) {
    try {
      const resp = await this.Medication.deleteMany();
    } catch (error) {
      console.log(`deleterelatedPractitioner LMP:${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  async validatePatientId(patientId) {
    try {
      const patientInfo = await this.Patient.findOne({ _id: patientId });
      const isValid = mongoose.isValidObjectId(patientId);
      if (!patientInfo && !isValid) {
        return -1;
      } else {
        return 1;
      }
    } catch (error) {
      console.log(error);
    }
  }
})();
