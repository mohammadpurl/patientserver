const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')

router.get(
    '/patients',
    // validator.paRegisterValidation(),
    // controller.validate,
    controller.getALlPatientList


)
router.post(
    '/patients',
    // validator.paRegisterValidation(),
    // controller.validate,
    controller.patientRegister)

router.get(
    '/patients/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.patientDetail

)
router.put(
    '/patients/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.patientUpdate

)
router.post(
    '/guardians',
    validator.dgRegisterValidation(),
    // controller.validate,
    controller.registerGuardian


)

router.get(
    '/guardians',
    validator.dgRegisterValidation(),
    // controller.validate,
    controller.getAllGuardian


)

router.get(
    '/profile',
    // validator.loginValidation(),
    // controller.validate,
    controller.profile

)


router.post(
    '/guardiantopatient',
    // validator.loginValidation(),
    // controller.validate,
    controller.guardianToPatient

)
router.post(
    '/savemedication',
    // validator.loginValidation(),
    // controller.validate,
    controller.InsertMedicationToPatient

)
router.post(
    '/savelastthirty',
    // validator.loginValidation(),
    // controller.validate,
    controller.InsertLastThirtyToPatient

)
router.post(
    '/savemedicalhistopatient',
    // validator.loginValidation(),
    // controller.validate,
    controller.InsertMedicalHisToPatient

)






module.exports = router