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
  
})();
6