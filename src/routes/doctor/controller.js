const controller = require("./../controller");
const Hospital = require("./../../modeles/hospital");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const GuardianToPatient = require("./../../modeles/guardianTopatient");
const { json } = require("stream/consumers");
const { default: mongoose } = require("mongoose");

module.exports = new (class extends controller {
  // *********************Get all Doctors**********************
  async getALlDoctors(req, res) {
    try {
      const isAdmin = req?.user?.isadmin;
      console.log(`isAmin: ${isAdmin}`);
      console.log("getALlDoctorsList");
      if (isAdmin) {
        let userInfo = await this.User.find({
          isDoctor: true,
          conformIsDoctor: true,
        });
        console.log(`userInfo:${userInfo}`);
        this.response({
          res,
          message: "",
          data: userInfo,
        });
      } else {
        this.response({
          res,
          code: "403",
          message: "Access Denied",
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }

  // ************************************insert Doctor or Guardian
  async registerPractitioner(req, res) {
    try {
      console.log("registerDoctor");
      const practitionerList = req?.body?.practitionerList;
      for (const {
        email,
        isDoctor,
        firstName,
        lastName,
        title,
        mobileNumber,
      } of practitionerList) {
        const newPractitioner = new this.User({
          email,
          isDoctor,
          firstName,
          lastName,
          title,
          mobileNumber,
        });
        const creatorId = req.user._id;
        newPractitioner.creatoreId = creatorId;
        let id = await this.savePractitionerInDB(newPractitioner, res);
        console.log(`PractitionerID ${id}`)
        req.body.practitionerId = id;

        const dToP = await this.practitionerToPatient(req, id);
      }
      this.response({
        res,
        message: " successfully pto registered",
        data: {},
      });
      
    } catch (error) {
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
      return response._id;
    } catch (error) {
      console.log(` lmp practitionerToPatient ${error}`);
      return -1;
    }
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
