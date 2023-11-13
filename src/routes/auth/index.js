const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')

// router.post('/login',(req,res)=>{
//     res.send("login")
// })
router.post(
    '/register',
    validator.registerValidation(),
    controller.validate,
    controller.register

)
router.post(
    '/login',
    validator.loginValidation(),
    controller.validate,
    controller.login)

router.post(
    '/logout',
    controller.logout)

router.post(
    '/token',
    controller.verifyRefreshToken,
    controller.GetAccessToken)

router.get(
    '/nationality',
    controller.GetAllNationality)


router.post(
    '/insertnationbulk',
    controller.InsertNationality)

router.get(
    '/languages',
    controller.GetAllLanguages)


router.post(
    '/insertlanguages',
    controller.InsertLanguages)

router.get(
    '/religiones',
    controller.GetAllReligions)


router.post(
    '/insertreligiones',
    controller.InsertReligion)

router.get(
    '/mstatuses',
    controller.GetAllMStatuss)


router.post(
    '/insertmstatus',
    controller.InsertMstatuses)

router.get(
    '/education',
    controller.GetAllEducation)


router.post(
    '/insertsexuality',
    controller.InsertSexuality)

router.get(
    '/sexuality',
    controller.GetSexuality)


router.post(
    '/insertcountries',
    controller.InsertCountries)

router.get(
    '/country',
    controller.GetAllCountries)

router.post(
    '/inserttitle',
    controller.InsertTitle)

router.get(
    '/title',
    controller.GetAllTitles)

router.post(
    '/insertmedication',
    controller.InsertMedication)

router.get(
    '/medication',
    controller.GetAllMedicationes)

router.post(
    '/insertlastthirty',
    controller.InserttLastThirty)

router.get(
    '/lastthirtyitems',
    controller.GetLastThirtyItems)

router.post(
    '/insertwomenhistory',
    controller.InserttWomenHistory)

router.get(
    '/womenhistoryItem',
    controller.GetWomenHistoryItems)

module.exports = router