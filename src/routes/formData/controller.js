const controller = require('./../controller');
const _ = require("lodash");


const nations = require('./../../Data/nationality.json')
const languages = require('./../../Data/languages.json')
const religiones = require('./../../Data/religions.json')
const mstatuses = require('./../../Data/MStatus.json')
const educationList = require('./../../Data/education.json')
const sexualities = require('./../../Data/sexualities.json')
const Countries = require('./../../Data/country.json')
const TitleList = require('./../../Data/title.json')
const MedicationList = require('./../../Data/medication.json')
const LastThirtyList = require('./../../Data/lastThirty.json')
const WomenHistoryList = require('./../../Data/womenHistory.json')
const medicalHistoryList = require('./../../Data/medicalHistory.json')
const hurtTypeList = require("./../../Data/hurtType.json")
const MenHistoryList = require('./../../Data/menHistory.json')

require('dotenv').config();
// const redis_client = require('./../../../redis_connect');

module.exports = new (class extends controller {
    

    // *********************************     Nationalities ************************************
    async GetAllNationality(req, res) {
        try {

            let nationalities = await this.Nationality.find()
            this.response({
                res, message: "",
                data: nationalities
            });
            
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    async InsertNationality(req, res) {
        try {

            
            for (var i = 0; i < nations.length; i++) {
                console.log(nations[i].name)
                let nationality = new this.Nationality();
                nationality.name = nations[i].name ;
                nationality.code = nations[i].code

                const response = await nationality.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************     Languages ************************************
    async GetAllLanguages(req, res) {
        try {

            let languages = await this.Language.find()
            this.response({
                res, message: "",
                data: languages
            });
            
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    async InsertLanguages(req, res) {
        try {

            
            for (var i = 0; i < languages.length; i++) {
                console.log(languages[i].name)
                let language = new this.Language();
                language.name = languages[i].name ;
                language.code = languages[i].code

                const response = await language.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************     religions ************************************
    async GetAllReligions(req, res) {
        try {

            let religions = await this.Religion.find()

            this.response({
                res, message: "",
                data: religions
            });
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    async InsertReligion(req, res) {
        try {

            
            for (var i = 0; i < religiones.length; i++) {
                console.log(religiones[i].name)
                let religion = new this.Religion();
                religion.name = religiones[i].name ;
                religion.code = religiones[i].code

                const response = await religion.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
     // *********************************     mstatus ************************************
     async GetAllMStatuss(req, res) {
        try {

            let mstatuses = await this.MStatus.find()
            this.response({
                res, message: "",
                data: mstatuses
            });
            
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    async InsertMstatuses(req, res) {
        try {

            
            for (var i = 0; i < mstatuses.length; i++) {
                console.log(mstatuses[i].name)
                let mstatus = new this.MStatus();
                mstatus.name = mstatuses[i].name ;
                mstatus.code = mstatuses[i].code

                const response = await mstatus.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
     // *********************************     mstatus ************************************
     async GetAllEducation(req, res) {
        try {

            let education = await this.Education.find()
            this.response({
                res, message: "",
                data: education
            });
            
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    async InsertEducation(req, res) {
        try {

            
            for (var i = 0; i < educationList.length; i++) {
                console.log(educationList[i].name)
                let education = new this.Education();
                education.name = educationList[i].name ;
                education.code = educationList[i].code

                const educationItem = await education.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************     GetSexuality ************************************
    async GetSexuality(req, res) {
        try {

            let sexuality = await this.Sexuality.find()
            this.response({
                res, message: "",
                data: sexuality
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "Ysomething went wrong", data: error });
        }
    }

    async InsertSexuality(req, res) {
        try {

            
            for (var i = 0; i < sexualities.length; i++) {
                console.log(sexualities[i].name)
                let sex = new this.Sexualities();
                sex.name = sexualities[i].name ;
                sex.code = sexualities[i].code

                const educationItem = await sex.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************     country ************************************
    async GetAllCountries(req, res) {
        try {

            let countries = await this.Country.find()
            this.response({
                res, message: "",
                data: countries
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InsertCountries(req, res) {
        try {

            
            for (var i = 0; i < Countries.length; i++) {
                
                let country = new this.Country();
                country.name = Countries[i].name ;
                country.code = Countries[i].code

                const countryItem = await country.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************     title ************************************
    async GetAllTitles(req, res) {
        try {

            let titles = await this.Title.find()
            this.response({
                res, message: "",
                data: titles
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InsertTitle(req, res) {
        try {

            
            for (var i = 0; i < TitleList.length; i++) {
                
                let title = new this.Title();
                title.name = TitleList[i].name ;
                title.code = TitleList[i].code

                const titleItem = await title.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************     Hurt type ************************************
    async GetAllHurtTypes(req, res) {
        try {

            let hurtType = await this.HurtType.find()
            this.response({
                res, message: "",
                data: hurtType
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InsertHurtType(req, res) {
        try {
            for (const { code, name } of hurtTypeList) {
                const hurtTypeItem = new this.HurtType({
                    code,
                    name
                });                
                const response = await hurtTypeItem.save();                

            }            
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************  Medication ************************************
    async GetAllMedicationes(req, res) {
        try {

            let medications = await this.Medication.find()
            this.response({
                res, message: "",
                data: medications
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InsertMedication(req, res) {
        try {

            const resp = await this.Medication.deleteMany()
            for (var i = 0; i < MedicationList.length; i++) {
                
                let medication = new this.Medication();
                medication.name = MedicationList[i].name ;
                medication.code = MedicationList[i].code

                const medicationItem = await medication.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************  last 30 day ************************************
    async GetLastThirtyItems(req, res) {
        try {

            let lastthirty = await this.SymptomsThirty.find()
            this.response({
                res, message: "",
                data: lastthirty
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InserttLastThirty(req, res) {
        try {

            console.log( LastThirtyList.length)
            for (var i = 0; i < LastThirtyList.length; i++) {
                console.log(LastThirtyList[i].name)
                let lastThirty = new this.SymptomsThirty();
                lastThirty.name = LastThirtyList[i].name ;
                lastThirty.parentID = LastThirtyList[i].parentID;
                lastThirty.id = LastThirtyList[i].id

                const lastThirtyItem = await lastThirty.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************  Women History ************************************
    async GetWomenHistoryItems(req, res) {
        try {

            let womenHistory = await this.womenHistory.find()
            this.response({
                res, message: "",
                data: womenHistory
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InserttWomenHistory(req, res) {
        
        try {
            
            for (var i = 0; i < WomenHistoryList.length; i++) {
                
                let womenHistory = new this.womenHistory();
                womenHistory.description = WomenHistoryList[i].description ;
                womenHistory.code = WomenHistoryList[i].code;
                womenHistory.type = WomenHistoryList[i].type

                const womenHistoryItem = await womenHistory.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
    // *********************************  Men History ************************************
    async GetMenHistoryItems(req, res) {
        try {

            let menHistory = await this.MenHistory.find()
            this.response({
                res, message: "",
                data: menHistory
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InsertMenHistory(req, res) {
        
        try {
            for (const {description, value, code} of MenHistoryList)
             {
                
                let menHistory = new this.MenHistory({
                    description,
                    code,
                    value
                })                

                const menHistoryItem = await menHistory.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }
     // *********************************  Medical History ************************************
     async GetMedicalHistoryItems(req, res) {
        try {

            let medicalHistory = await this.MedicalHistory.find()
            this.response({
                res, message: "",
                data: medicalHistory
            });
        } catch (error) {
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

    async InserttMedicalHistory(req, res) {
        try {
            const resp = await this.MedicalHistory.deleteMany()
            for (var i = 0; i < medicalHistoryList.length; i++) {
                
                let medicalHistory = new this.MedicalHistory();
                medicalHistory.name = medicalHistoryList[i].name ;
                medicalHistory.code = medicalHistoryList[i].code;
                medicalHistory.type = medicalHistoryList[i].type

                const medicalHistoryItem = await medicalHistory.save();
                console.log(`medicalHistoryItem${medicalHistoryItem}`)
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: true, message: "something went wrong", data: error });
        }
    }

})();