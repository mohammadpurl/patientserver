const express = require('express');
const router = express.Router();
const controller = require('./controller');




router.get(
    '/nationalities',
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
    '/sexualities',
    controller.GetSexuality)


router.post(
    '/insertcountries',
    controller.InsertCountries)

router.get(
    '/countries',
    controller.GetAllCountries)

router.post(
    '/inserttitle',
    controller.InsertTitle)

router.get(
    '/titles',
    controller.GetAllTitles)


router.post(
    '/insertHurtType',
    controller.InsertHurtType)

router.get(
    '/hurtTypes',
    controller.GetAllHurtTypes)

router.post(
    '/insertmedication',
    controller.InsertMedication)

router.get(
    '/currentmedications',
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
    '/womenhistoryitems',
    controller.GetWomenHistoryItems)

router.post(
    '/insertmenhistory',
    controller.InsertMenHistory)

router.get(
    '/menhistoryitems',
    controller.GetMenHistoryItems)
router.post(
    '/insertmedicalhistory',
    controller.InserttMedicalHistory)

router.get(
    '/pastmedicalhistory',
    controller.GetMedicalHistoryItems)

module.exports = router