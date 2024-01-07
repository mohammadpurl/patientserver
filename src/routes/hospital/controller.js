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
      console.log("registerHospital");
      const hospitalList = req?.body?.hospitalList
      const patientId = req?.body?.patientId
      let resp
      for(const {name, country, reason, date} of hospitalList){
      let hospital = await this.Hospital.findOne({
        name: name,
        country: country,
      });
      console.log(hospital);
      let hospitalId;
      if (!hospital) {
        hospital = new this.Hospital({
          name: name,
          country: country,
        });
        const response = await hospital.save();
        if (response?._id) {
          hospitalId = response?._id;
        }
      }
      else{
        hospitalId = hospital._id
      }
       resp = await this.hospitalToPatient(patientId, reason, date, hospitalId)     
      
    }
    this.response({
      res,
      message: "the hospital information successfully registered",
      data: {},
    });
      
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  //********************************hospital to patient************************************ */
  async hospitalToPatient(patientId, reason, date, hospitalId) {
    try {
      console.log("hospitalToPatient");
      
      let hospitalToPatient = await this.HospitalToPatient.findOne({
        patientId: patientId,
        hospitalId: hospitalId,
        date: date
      });
      console.log(hospitalToPatient);
      if (!hospitalToPatient) {
        hospitalToPatient = new this.HospitalToPatient({
          hospitalId: hospitalId,
          patientId: patientId,
          date: date,
          reason: reason,
        });
        const response = await hospitalToPatient.save();
        return response;
      } 
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // *******************************get hospital info
  async getHospitalInfo(req, res) {
    try {
      const patientId = req?.params?.id;
      const hospitalInfo = await this.HospitalToPatient.find({patientId:patientId})
      .populate("hospitalId", "country code");
      // .populate({
      //   path: 'hospitalId',
      //   select:"name",
      //   populate: [
      //     {
      //       path: 'country',
      //       model: 'Country'
      //     }
      //   ]
      // })
      console.log("hospitalInfo",hospitalInfo)
      // const finalHospitalInfo = await this.convertHistoryResponse(hospitalInfo)
      const finalHospitalInfo = await Promise.all(
        hospitalInfo.map(async (item) =>{
          const transformInfo =await this.convertHistoryResponse(item)
          return transformInfo
    })
      );
      this.response({
        res,
        message: "successful",
        data: finalHospitalInfo,
      });



    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "something went wrong", data: error });
    }
  }
  // ****************************************convert response
  
  async convertHistoryResponse(item) {
    // const transformedData = response.map(async item => {
      const { _id, reason, patientId, date, hospitalId, updatedAt, createdAt, __v } = item;     
      const { _id:HospitalId, hospitalname, country } = hospitalId;
      const countryInfo = await this.Country.findOne({_id:country.toString()});
      console.log("convertHistoryResponse country",countryInfo )
      let code = "";
      let name = "";
      if(countryInfo){
        code = countryInfo?.code;
        name = countryInfo?.name;
      }
  
      const transformedData= {
        _id,
        reason,
        date,
        patientId,
        hospitalID: HospitalId,
        hospitalname,
        code,
        name,
        updatedAt,
        createdAt,
        __v
      };
    // });
  
    return transformedData;
  }
})();
