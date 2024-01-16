const controller = require("./../controller");
const Hospital = require("./../../modeles/hospital");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

module.exports = new (class extends controller {
  //get all visit list for a patient
  async getALlPatientList(req, res) {
    try {
      console.log("getALlPatientList");

      let userInfo = await this.Patient.find({ user: req.user._id })
        .populate("user", "email")
        .populate("religion", "name -_id")
        .populate("nationality", "name -_id")
        .populate("sexuality", "name -_id")
        .populate("mStatus", "name -_id")
        .populate("languages", "name -_id")
        .populate("education", "name -_id")
        .populate("title", "name _id")
        .populate("country", "name  code _id");

      const processedObjects = userInfo?.map((userInfo) =>
        this.processObject(userInfo, "show")
      );
      this.response({
        res,
        message: "",
        data: processedObjects,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *********************Register patients**********************
  async patientRegister(req, res) {
    try {
      const userId = req.user._id;
      console.log("patientRegister");
      let patient = new this.Patient(
        _.pick(req.body, [
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
          "birthDate",
          "editable",
        ])
      );

      patient.user = userId;
      const response = await patient.save();

      console.log(`patient register ${response}`);
      const respondePatient = this.processObject(response);
      this.updateProfile(req, res);
      this.response({
        res,
        message: "the user successfully registered",
        data: respondePatient,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }

  // *********************prifile**********************
  async profile(req, res) {
    try {
      console.log(`req.user${req.user}`);
      let userInfo = await this.User.findOne({ _id: req.user._id })
        .populate("religion", "name code _id")
        .populate("nationality", "name code _id")
        .populate("sexuality", "name code _id")
        .populate("mStatus", "name code _id")
        .populate("languages", "name code _id")
        .populate("education", "name  code _id")
        .populate("country", "name  code _id")
        .populate("title", "name _id");
      console.log(`userInfo in profile${JSON.stringify(userInfo)} `);

      const userData = this.processObject(userInfo, "show");

      console.log(`userData:${JSON.stringify(userData)}`);
      this.response({ res, data: userData });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *********************update prifile**********************
  async updateProfile(req, res) {
    try {
      console.log("updateProfile");
      const user = _.pick(req.body, [
        "title",
        "firstName",
        "lastName",
        "mobileNumber",
        "birthDate",
        "address",
        "country",
        "religion",
        "mStatus",
        "education",
        "languages",
      ]);
      console.log(`updateProfile ${req.user._id} `);
      const profileInfo = await this.User.findByIdAndUpdate(
        { _id: req.user._id },
        user
      );
      console.log(` profileInfo ${profileInfo}`);
    } catch (error) {
      console.log(error);
    }
  }
  // *********************patientDeatil**********************
  async patientDetail(req, res) {
    try {
      const patientId = req.params.id;

      let userInfo = await this.Patient.findOne({ _id: patientId })
        .populate("user", "email")
        .populate("religion", "name code _id")
        .populate("nationality", "name code _id")
        .populate("sexuality", "name code _id")
        .populate("mStatus", "name code _id")
        .populate("languages", "name code _id")
        .populate("education", "name  code _id")
        .populate("country", "name  code _id")
        .populate("title", "name _id");

      console.log(`patientDetail userInfo: ${userInfo}`);
      if (userInfo) {
        const userData = this.processObject(userInfo);
        this.response({
          res,
          message: "",
          data: userData,
        });
      } else {
        this.response({
          res,
          message: "",
          data: {},
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *********************delete a patient**********************
  async patientDelete(req, res) {
    try {
      const patientId = req.params.id;
      const userId = req.user._id;

      let userInfo = await this.Patient.findOne({ _id: patientId });
      const UserIdFromDB = userInfo?.user?._id;
      console.log(`patientDelete userInfo: ${userInfo}`);

      console.log(UserIdFromDB);
      console.log(userId);

      // TODO Must add Guardins
      if (!userId.equals(UserIdFromDB)) {
        this.response({
          res,
          message: "Access denied!",
          code: "403",
          data: {},
        });
      } else if (!userInfo) {
        this.response({
          res,
          message: "data not found",
          code: "404",
          data: {},
        });
      } else if (!userInfo.editable) {
        this.response({
          res,
          message: "This visit cannot be deleted",
          code: "403",
          data: {},
        });
      } else {
        await this.Patient.findOneAndDelete({ _id: patientId });
        this.response({
          res,
          message: "seccess",
          data: {},
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  //********************************patientUpdate************************************ */
  async patientUpdate(req, res) {
    try {
      // const isAdmin = req.user.isadmin

      // const hasAccess = this.checkAccess(req, res);
      // TODO must check access
      const hasAccess = true;
      if (!hasAccess) {
        console.log(`hasAccess = ${hasAccess}`);
        return res
          .status(403)
          .json({ status: false, message: "Access denied", data: {} });
      }

      const pationtId = req.params.id;

      const updateParams = req.body;

      // Find the document by ID and update it with the new parameters
      const updatedDocument = await this.Pationt.findByIdAndUpdate(
        pationtId,
        updateParams
      );
      const id = _.pick(updatedDocument, ["_id"]);
      const patientInfo = await this.Patient.findOne({ _id: id });
      const patientData = this.processObject(patientInfo);
      console.log(`patientUpdate${JSON.stringify(patientInfo)}`);
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      } else {
        console.log(patientData);
        this.response({ res, data: patientData });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }

  // *******************************************calculate age
  _calculateAge(birthday) {
    try {
      // birthday is a date
      var ageDifMs = Date.now() - birthday?.getTime();
      console.log(`ageDifMs${ageDifMs}`);
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
  // ****************************************get user info
  processObject(userInfo, type) {
    try {
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
        country,
        editable,
      } = userInfo;
      console.log(`296 processObject userInfo:${userInfo}`);
      const email = userInfo?.email ? userInfo?.email : user?.email;
      const religionId = religion?._id;
      const nationalityId = nationality?._id;
      const sexualityId = sexuality?._id;
      const mStatusId = mStatus?._id;
      const educationId = education?._id;
      const countryId = country?._id;
      const titleId = title?._id;
      const fullName = `${firstName} ${lastName}`;
      const BMI = weight / Math.pow(height, 2);
      console.log("BMI" + BMI);
      console.log(Math.pow(height, 2));
      const age = this._calculateAge(birthDate);
      const languages = [];
      userInfo?.languages?.map((language) => languages.push(language._id));
      console.log("processObject email", email);
      const userData = {
        id: _id,
        email: email,
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
        country: countryId,
        editable,
      };
      console.log(`339 processObject userData ${JSON.stringify(userData)}`);
      if (type && type == "show") {
        const languages = [];
        languages.map((language) => {
          console.log(`processObject${language.name}`);
          languages.push(language.name);
        });

        userData.religion = religion?.name;
        userData.nationality = nationality?.name;
        userData.sexuality = sexuality?.name;
        userData.mStatus = mStatus?.name;
        userData.education = education?.name;
        userData.languages = languages;
        userData.title = title?.name;
      }
      return userData;
    } catch (error) {
      return null;
    }
  }

  // ************************InsertMedicationToPatient****************************
  async insertMedicationToPatient(req, res) {
    try {
      console.log("InsertMedicationToPatient");
      const medicationList = req.body?.medicationList;
      console.log(`medicationList${JSON.stringify(medicationList)}`);

      const patientId = req.body?.patientId;
      console.log(`patientId${patientId}`);
      const hasMedicationValue = await this.MedicationToPatient.find({
        patientId: patientId,
      });
      if (hasMedicationValue) {
        const resp = await this.MedicationToPatient.deleteMany({
          patientId: patientId,
        });
      }

      for (const {
        medicationId,
        howManydays,
        dosePerDay,
        drugStrength,
      } of medicationList) {
        const medicationToPatient = new this.MedicationToPatient({
          howManydays,
          dosePerDay,
          drugStrength,
          patientId,
          medicationId,
        });
        const response = await medicationToPatient.save();
        console.log(
          `medicalHisToPatient in else response${JSON.stringify(response)}`
        );
      }
      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: true, message: "something went wrong", data: error });
    }
  }
  // **********************************getAllGuardian*****************************
  async getAllMedication(req, res) {
    try {
      const patientId = req.params?.id;
      console.log(`getAllMedication patientId ${patientId}`);
      const medication = await this.MedicationToPatient.find({
        patientId: patientId,
      }).populate("medicationId", "name code");
      console.log(`getAllMedication medication ${medication}`);

      this.response({ res, data: medication });
    } catch (error) {
      console.log(`Medication${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }

  // ************************InsertMedicalHisToPatient****************************
  async insertMedicalHisToPatient(req, res) {
    try {
      console.log(req.body);
      const medicalHisList = req.body?.medicalHisList;
      console.log(`medicalHisList${JSON.stringify(medicalHisList)}`);
      const patientId = req.body?.patientId;
      console.log(`patientId ${patientId}`);
      const hasHistory = await this.medicalHisToPatient.find({
        patientId: patientId,
      });
      if (hasHistory) {
        const resp = await this.medicalHisToPatient.deleteMany({
          patientId: patientId,
        });
      }
      for (const { medicalHisId, value } of medicalHisList) {
        const medicalHisToPatient = new this.medicalHisToPatient({
          medicalHisId,
          value,
          patientId,
        });
        console.log(
          `medicalHisToPatient ${JSON.stringify(medicalHisToPatient)}`
        );
        const response = await medicalHisToPatient.save();
        console.log(
          `medicalHisToPatient in else response${JSON.stringify(response)}`
        );
      }
      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: true, message: "something went wrong", data: error });
    }
  }
  // **********************************getAllMedicalHistory*****************************
  async getAllMedicalHistory(req, res) {
    try {
      const patientId = req.params?.id;
      const medicalHisory = await this.medicalHisToPatient
        .find({ patientId: patientId })
        .populate("medicalHisId", "name code");
      this.response({ res, data: medicalHisory });
    } catch (error) {
      console.log(`medicalHisory${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ************************Insert Women History ToPatient****************************
  async insertWomenHistoryToPatient(req, res) {
    try {
      console.log("insertWomenHistoryToPatient");
      const {
        ageOfFirstPeriod,
        numberOfPregnancies,
        numberOfMiscarriages,
        numberOfAbortions,
        regularMenstrual,
        abnormalPAPSmear,
        lastPapSmearDate,
        bleedingBetweenMenstrual,
        patientId,
      } = req.body;
      console.log(`patientId${patientId}`);
      const hasWomenHistory = await this.WomenHistoryToPatient.find({
        patientId: patientId,
      });
      if (hasWomenHistory) {
        const resp = await this.WomenHistoryToPatient.deleteMany({
          patientId: patientId,
        });
      }

      const womenHistoryToPatient = new this.WomenHistoryToPatient({
        ageOfFirstPeriod,
        numberOfPregnancies,
        numberOfMiscarriages,
        numberOfAbortions,
        regularMenstrual,
        abnormalPAPSmear,
        lastPapSmearDate,
        bleedingBetweenMenstrual,
        patientId,
      });
      const response = await womenHistoryToPatient.save();
      console.log(`WomenHistoryToPatient ${JSON.stringify(response)}`);

      return res
        .status(200)
        .json({ status: true, message: "success.", data: response });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: true, message: "something went wrong", data: error });
    }
  }
  // **********************************get Women History*****************************
  async getWomenHistory(req, res) {
    try {
      const patientId = req?.params?.id;
      console.log(`getWomenHistory patientId ${patientId}`);
      const womenHistory = await this.WomenHistoryToPatient.findOne({
        patientId: patientId,
      })
      // .populate("womenHistoryId", "description code");
      console.log(`getWomenHistory ${womenHistory}`);
      // const resp = this.convertHistoryResponse(womenHistory, "women");
      this.response({ res, data: womenHistory });
    } catch (error) {
      console.log(`getWomenHistory${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }

  // ************************Insert Women History ToPatient****************************
  async insertMenHistoryToPatient(req, res) {
    try {
      console.log("insertMenHistoryToPatient");

      const {
        erectileDysfunction,
        reducedLibido,
        frequentUrinationsinDay,
        frequentUrinationsinNight,
        patientId,
        
      } = req.body;
      console.log(`patientId${patientId}`);
      const hasMenHistory = await this.MenHistoryToPatient.find({
        patientId: patientId,
      });
      if (hasMenHistory) {
        const resp = await this.MenHistoryToPatient.deleteMany({
          patientId: patientId,
        });
      }      
      const menHistoryToPatient = new this.MenHistoryToPatient({
        erectileDysfunction,
        reducedLibido,
        frequentUrinationsinDay,
        frequentUrinationsinNight,
        patientId,
      });
      const response = await menHistoryToPatient.save();
      console.log(`menHistoryToPatient ${JSON.stringify(response)}`);
      
      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: true, message: "something went wrong", data: error });
    }
  }
  // **********************************get Women History*****************************
  async getMenHistory(req, res) {
    try {
      const patientId = req?.params?.id;
      console.log(`getMenHistory patientId ${patientId}`);
      const menHistory = await this.MenHistoryToPatient.find({
        patientId: patientId,
      }).populate("menHistoryId", "description code");
      console.log(`getMenHistory ${menHistory}`);
      const resp = this.convertHistoryResponse(menHistory, "men");
      this.response({ res, data: resp });
    } catch (error) {
      console.log(`getMenHistory ${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ****************************************convert response

  convertHistoryResponse = (response, historyType) => {
    const transformedData = response.map((item) => {
      const {
        _id,
        value,
        patientId,
        menHistoryId,
        womenHistoryId,
        updatedAt,
        createdAt,
        __v,
      } = item;
      const historyIdObj =
        historyType === "men" ? menHistoryId : womenHistoryId;
      const { _id: historyId, description, code } = historyIdObj;

      return {
        _id,
        value,
        patientId,
        [`${historyType}HistoryId`]: historyId,
        description,
        code,
        updatedAt,
        createdAt,
        __v,
      };
    });
    return transformedData;
  };
  // ************************InsertMedicationToPatient****************************
  async insertLastThirtyToPatient(req, res) {
    try {
      console.log("InsertLastThirtyToPatient");
      const lastThirtyList = req.body?.lastThirtyList;
      console.log(`lastThirtyList${JSON.stringify(lastThirtyList)}`);
      const patientId = req.body?.patientId;
      console.log(`patientId${patientId}`);
      const lastThirty = await this.LastThirtyToPatient.find({
        patientId: patientId,
      });
      if (lastThirty) {
        const resp = await this.LastThirtyToPatient.deleteMany({
          patientId: patientId,
        });
      }
      for (var i = 0; i < lastThirtyList.length; i++) {
        console.log("lastThirty" + lastThirtyList[i].lastThirtyItem);
        let lastThirtyToPatient = new this.LastThirtyToPatient();
        lastThirtyToPatient.lastThirtyId = lastThirtyList[i].lastThirtyItem;
        lastThirtyToPatient.value = lastThirtyList[i].value;
        lastThirtyToPatient.patientId = patientId;
        const response = await lastThirtyToPatient.save();
        console.log(`lastThirtyList response${JSON.stringify(response)}`);
      }

      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: true, message: "something went wrong", data: error });
    }
  }

  // **********************************getAllMedicalHistory*****************************
  async getAllLastThirty(req, res) {
    try {
      const patientId = req.params?.id;
      const lastThirtyToPatient = await this.LastThirtyToPatient.find({
        patientId: patientId,
      }).populate("lastThirtyId", "name code");
      this.response({ res, data: lastThirtyToPatient });
    } catch (error) {
      console.log(`medicalHisory${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }

  // *******************************************check access
  checkAccess(req, res, next) {
    try {
      userId = req.user._id;
      req.params.id = userId;
      const hasAccess = false;
      if (
        req.gRelatedPatientList.includes(userId) ||
        req.dRelatedPatientList.includes(userId) ||
        userId == req.user._id
      ) {
        hasAccess = true;
      }
      if (hasAccess) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      // return res.status(500).json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *******************************************Add pain area
  async registerePainArea(req, res) {
    try {
      const patientId = req.body?.patientId;
      const hurtList = req.body?.hurtList;
      console.log(`patientId${patientId}`);
      let hurtArea = await this.HurtArea.find({ patientId: patientId });
      if (hurtArea) {
        const resp = await this.HurtArea.deleteMany({ patientId: patientId });
      }

      for (const { areaName, rate, hurtTypeId, isFront } of hurtList) {
        hurtArea = new this.HurtArea({
          areaName,
          rate,
          patientId,
          hurtTypeId,
          isFront,
        });
        console.log(`hurtArea ${JSON.stringify(hurtArea)}`);
        const response = await hurtArea.save();
        console.log(`HurtArea  response${JSON.stringify(response)}`);
      }

      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *******************************************Get pain area
  async getAllPainArea(req, res) {
    try {
      const patientId = req.params?.id;
      const painAreas = await this.HurtArea.find({
        patientId: patientId,
      }).populate("hurtTypeId", "name code");
      this.response({ res, data: painAreas });
    } catch (error) {
      console.log(`painAreas${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ******************************************register PsychotherapyTopatient
  async registerePsychotherapy(req, res) {
    try {
      const patientId = req.body?.patientId;
      const psychotherapyList = req.body?.psychotherapyList;
      console.log(`patientId${patientId}`);
      let psychotherapyInfo = await this.PsychotherapyTopatient.find({
        patientId: patientId,
      });
      if (psychotherapyInfo) {
        const resp = await this.PsychotherapyTopatient.deleteMany({
          patientId: patientId,
        });
      }

      for (const { psychotherapyId, when } of psychotherapyList) {
        psychotherapyInfo = new this.PsychotherapyTopatient({
          psychotherapyId,
          when,
          patientId,
        });
        console.log(
          `registerePsychotherapy ${JSON.stringify(psychotherapyInfo)}`
        );
        const response = await psychotherapyInfo.save();
        console.log(
          `registerePsychotherapy  response${JSON.stringify(response)}`
        );
      }

      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *******************************************Get PsychotherapyTopatient
  async getPsychotherapyToPatient(req, res) {
    try {
      const patientId = req.params?.id;
      const psychotherapyTopatient = await this.PsychotherapyTopatient.find({
        patientId: patientId,
      }).populate("psychotherapyId", "name");
      this.response({ res, data: psychotherapyTopatient });
    } catch (error) {
      console.log(`getPsychotherapyToPatient${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ******************************************register ImmunisationTopatient
  async registereImmunisation(req, res) {
    try {
      const patientId = req.body?.patientId;
      const immunisationList = req.body?.immunisationList;
      console.log(`patientId${patientId}`);
      let immunisationInfo = await this.ImmunisationTopatient.find({
        patientId: patientId,
      });
      if (immunisationInfo) {
        const resp = await this.ImmunisationTopatient.deleteMany({
          patientId: patientId,
        });
      }

      for (const { immunisationId, value } of immunisationList) {
        immunisationInfo = new this.ImmunisationTopatient({
          immunisationId,
          value,
          patientId,
        });
        console.log(
          `registereImmunisation ${JSON.stringify(immunisationInfo)}`
        );
        const response = await immunisationInfo.save();
        console.log(
          `registereImmunisation  response${JSON.stringify(response)}`
        );
      }

      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *******************************************Get Immunisation
  async getImmunisationIdToPatient(req, res) {
    try {
      const patientId = req.params?.id;
      const immunisationToPatient = await this.ImmunisationTopatient.find({
        patientId: patientId,
      }).populate("immunisationId", "name");
      this.response({ res, data: immunisationToPatient });
    } catch (error) {
      console.log(`getimmunisationIdToPatient${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ******************************************register registereّFamiliHistoryToPatient
  async registerFamilyHistoryToPatient(req, res) {
    try {
      const patientId = req.body?.patientId;
      const familyHistoryList = req.body?.familyHistoryList;
      console.log(`patientId${patientId}`);
      let familyHistoryInfo = await this.FamilyHistoryToPatient.find({
        patientId: patientId,
      });
      if (familyHistoryInfo) {
        const resp = await this.FamilyHistoryToPatient.deleteMany({
          patientId: patientId,
        });
      }

      for (const {
        familyTypeId,
        isAlive,
        age,
        healthStatus,
        whatAge,
        cause,
      } of familyHistoryList) {
        familyHistoryInfo = new this.FamilyHistoryToPatient({
          familyTypeId,
          isAlive,
          age,
          healthStatus,
          whatAge,
          cause,
          patientId,
        });
        console.log(
          `registerFamilyHistoryToPatient ${JSON.stringify(familyHistoryInfo)}`
        );
        const response = await familyHistoryInfo.save();
        console.log(
          `registereّFamiliHistoryToPatient  response${JSON.stringify(
            response
          )}`
        );
      }

      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *******************************************Get Immunisation
  async getFamiliHistoryToPatient(req, res) {
    try {
      const patientId = req.params?.id;
      const familyHistoryToPatient = await this.FamilyHistoryToPatient.find({
        patientId: patientId,
      }).populate("familyTypeId", "name _id code");
      const resp = this.convertFamilyHistoryResponse(familyHistoryToPatient)
      this.response({ res, data: resp });
    } catch (error) {
      console.log(`getimmunisationIdToPatient${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }



   // ****************************************convert response

   convertFamilyHistoryResponse = (response) => {
    const transformedData = response.map((item) => {
      const {
        _id,
        isAlive,
        patientId,
        age,
        healthStatus,
        whatAge,
        cause,
        familyTypeId,
        updatedAt,
        createdAt,
        __v,
      } = item;
    
      const { _id: typeID, name:familyType, code } = familyTypeId;

      return {
        _id,        
        patientId,
        familyTypeId:typeID,
        familyType,
        isAlive,
        age,
        healthStatus,
        whatAge,
        cause,
        updatedAt,
        createdAt,
        __v,
      };
    });
    return transformedData;
  };
  // ******************************************register drugCategoryToPatient
  async registerDrugCategoryToPatient(req, res) {
    try {
      const patientId = req.body?.patientId;
      const drugCategoryList = req.body?.drugCategoryList;
      console.log(`patientId${patientId}`);
      let drugCategoryInfo = await this.DrugCategoryTopatient.find({
        patientId: patientId,
      });
      if (drugCategoryInfo) {
        const resp = await this.DrugCategoryTopatient.deleteMany({
          patientId: patientId,
        });
      }
      for (const {
        drugCategoryId,
        ageStarted,
        regularlyUseId,
        howManyYears,
        lastUseId,
        stillUsing,
      } of drugCategoryList) {
        drugCategoryInfo = new this.DrugCategoryTopatient({
          drugCategoryId,
          ageStarted,
          patientId,
          regularlyUseId,
          howManyYears,
          lastUseId,
          stillUsing,
        });
        console.log(
          `registere DrugCategoryTopatient ${JSON.stringify(drugCategoryInfo)}`
        );
        const response = await drugCategoryInfo.save();
        console.log(
          `DrugCategoryTopatient  response${JSON.stringify(response)}`
        );
      }

      return res
        .status(200)
        .json({ status: true, message: "success.", data: {} });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *******************************************Get Immunisation
  async getDrugCategoryTopatient(req, res) {
    try {
      const patientId = req.params?.id;
      const drugCategoryTopatient = await this.DrugCategoryTopatient.find({
        patientId: patientId,
      })
        .populate("drugCategoryId", "name")
        .populate("regularlyUseId", "name")
        .populate("lastUseId", "name");

      this.response({ res, data: drugCategoryTopatient });
    } catch (error) {
      console.log(`getDrugCategoryTopatient${error}`);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
})();
