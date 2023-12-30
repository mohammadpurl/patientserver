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
        console.log(`PractitionerID ${id}`);
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
  // ************************************practitioner to Patient
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

      this.sendEmailToPractitioners(req, practitionerId);
      return response._id;
    } catch (error) {
      console.log(` lmp practitionerToPatient ${error}`);
      return -1;
    }
  }
  // ************************send Email for practitioner****************************
  async sendEmailToPractitioners(req, practitionerId) {
    console.log("sendEmailToPractitioners");
    const patientId = req.body.patientId;
    let patientInfo = await this.Patient.findOne({ _id: patientId }).populate(
      "user",
      "email firstName lastName"
    );
    const patientName = `${patientInfo.firstName} ${patientInfo.lastName}`;
    console.log(patientInfo);
    let practitionerInfo = await this.User.findOne({ _id: practitionerId });

    const doctorName = `${practitionerInfo.firstName} ${practitionerInfo.lastName}`;

    email.sendMailToPractitioners(
      practitionerInfo?.email,
      patientName,
      doctorName,
      "practitioner"
    );
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
      })
        .populate({
          path: "practitionerId",
          select: "email firstName lastName mobileNumber",
          populate: {
            path: "title",
            select: "name",
          },
        })
        .lean();

      practitionerInfo = practitionerInfo.map((info) => {
        info.practitionerId.title = info.practitionerId.title.name;
        return info;
      });
      console.log(
        "178 relatedPractitionerToPatient practitionerInfo",
        practitionerInfo
      );

      practitionerInfo.map(async (practitioner) => {
        let titleInfo;
        if (practitioner?.practitionerId) {
          titleInfo = await this.Title.findOne({
            _id: practitioner?.practitionerId.title,
          });
          // practitioner?.practitionerId?.titleName = titleInfo?.name
          console.log;
        }
      });
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
  // ************************deleterelatedPractitioner****************************
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
  // ************************validatePatientId****************************
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
  // ************************Insert Practitioner comment****************************
  async InsertPractitionerComments(req, res) {
    try {
      const patientId = req.body.patientId;
      let patientInfo = await this.Patient.findOne({ _id: patientId }).populate(
        "user",
        "email firstName lastName"
      );
      const isValid = mongoose.isValidObjectId(patientId);
      const practitionerId = req.user?._id;
      const comment = req.body?.comment;
      if (patientInfo && isValid) {
        const commentPrToPt = new this.CommentPrToPt({
          patientId,
          practitionerId,
          comment,
        });
        const response = await commentPrToPt.save();
        console.log(
          `InsertPractitionerComments response${JSON.stringify(response)}`
        );
        return res
          .status(200)
          .json({ status: true, message: "success.", data: {} });
      }

      return res
        .status(500)
        .json({ status: true, message: "something went wrong", data: error });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: true, message: "something went wrong", data: error });
    }
  }
})();
