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
router.post(
    '/insertPsychotherapy',
    controller.InsertPsychotherapy)

router.get(
    '/psychotherapyItems',
    controller.GetPsychotherapyItems)
    
router.post(
    '/insertImmunisation',
    controller.InsertImmunisation)

router.get(
    '/immunisationItems',
    controller.GetImmunisationItems)

router.post(
    '/insertFamilyHistory',
    controller.InsertFamilyHistory)

router.get(
    '/familyHistoryItems',
    controller.GetFamilyHistoryItems)

router.post(
    '/insertFamilyType',
    controller.InsertFamilyType)

router.get(
    '/familyTypeItems',
    controller.GetFamilyTypeItems)

    

    
router.post(
    '/insertLastUse',
    controller.InsertLastUse)

router.get(
    '/lastUseItems',
    controller.GetLastUseItems)    

router.post(
    '/insertDrugCategory',
    controller.InsertDrugCategory)

router.get(
    '/drugCategoryItems',
    controller.GetDrugCategoryItems)    

router.post(
    '/insertRegularlyUse',
    controller.InsertRegularlyUse)

router.get(
    '/regularlyUseItems',
    controller.GetRegularlyUseItems) 
    
    
            
module.exports = router