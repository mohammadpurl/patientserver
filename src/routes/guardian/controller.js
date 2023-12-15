const controller = require("./../controller");
const Hospital = require("./../../modeles/hospital");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const GuardianToPatient = require("./../../modeles/guardianTopatient");
const email = require("./../mail");
const { json } = require("stream/consumers");

module.exports = new (class extends controller {
  // ************************************insert  Guardian
  async registerGuardian(req, res) {
    try {
      console.log("registerGuardian");
      const guardianList = req?.body?.guardianList;
      for (const {
        email,
        isDoctor,
        firstName,
        lastName,
        title,
        mobileNumber,
      } of guardianList) {
        const newGuardian = new this.User({
          email,
          isDoctor,
          firstName,
          lastName,
          title,
          mobileNumber,
        });
        const creatorId = req.user._id;

        newGuardian.creatorId = creatorId;
        let id = await this.saveGuardianInDB(newGuardian, res);
        req.body.guardianId = id;
        const gToP = await this.guardianToPatient(req, id);
      }
      this.response({
        res,
        message: " successfully gto registered",
        data: {},
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  //********************************saveGuardianInDB************************************ */
  async saveGuardianInDB(newGuardian) {
    try {
      console.log("saveGuardianInDB");
      let user = await this.User.findOne({ email: newGuardian?.email });
      if (user) {
        const id = _.pick(user, ["_id"]);
        console.log("finish saveGuardianoInDB");
        return id;
      }
      const salt = await bcrypt.genSalt(10);
      newGuardian.password = await bcrypt.hash(newGuardian.mobileNumber, salt);
      const response = await newGuardian.save();
      console.log(`saveGuardianoInDB${response}`);

      const id = _.pick(response, ["_id"]);
      return id;
    } catch (error) {
      console.log(`saveGuardianoInDB LMP:${error}`);
    }
  }
  // ************************************Guardian to Patient
  async guardianToPatient(req, guardianId) {
    try {
      console.log("guardianToPatient");
      const patientId = req.body.patientId;
      const guardiantopatient = await this.GuardianToPatient.findOne({
        guardianId: guardianId,
        patientId: patientId,
      });
      console.log(`guardiantopatient is: ${guardiantopatient}`);

      if (guardiantopatient) {
        console.log(`guardiantopatient._id ${guardiantopatient}`);
        return guardiantopatient._id;
      }
      const guardianToPatient = new this.GuardianToPatient({
        guardianId: guardianId,
        patientId: patientId,
      });

      const response = await guardianToPatient.save();
      this.sendEmailToGuardian(req, guardianId);
      console.log(`guardianToPatient ${guardianToPatient}`);
      return response._id;
    } catch (error) {
      console.log(` lmp    guardianToPatient ${error}`);
      return -1;
      // return res.status(500).json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ************************send Email for guardian****************************
  async sendEmailToGuardian(req, guardianId) {
    try {
      console.log("sendEmailToGuardian");
      const patientId = req.body.patientId;
      let patientInfo = await this.Patient.findOne({ _id: patientId }).populate(
        "user",
        "email firstName lastName"
      );
      const patientName = `${patientInfo.firstName} ${patientInfo.lastName}`;
      console.log(patientInfo);
      let guardianInfo = await this.User.findOne({ _id: guardianId });

      const guardianName = `${guardianInfo.firstName} ${guardianInfo.lastName}`;

      email.sendMailToPractitioners(
        guardianInfo?.email,
        patientName,
        guardianName,
        "guardian"
      );
    } catch (error) {
        console.log(error)
    }
  }
  // **********************************getAllGuardian*****************************
  async getAllGuardian(req, res) {
    try {
      const patientId = req.params.id;
      const guardians = await this.GuardianToPatient.find({
        patient: patientId,
      }).populate("guardian", "email firstName lastName mobileNumber title");
      this.response({ res, data: guardians });
    } catch (error) {
      console.log(`getAllGuardian${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
})();
