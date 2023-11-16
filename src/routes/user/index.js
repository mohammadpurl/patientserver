const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')


router.post(
    '/patientregister',
    // validator.paRegisterValidation(),
    // controller.validate,
    controller.patientRegister


)
router.post(
    '/registerdg',
    // validator.paRegisterValidation(),
    // controller.validate,
    controller.registerDoctorOrGuardian


)
router.get(
    '/userlist',
    // validator.paRegisterValidation(),
    // controller.validate,
    controller.getALlPatientList


)
router.post(
    '/hospitalregister',
    validator.hospitalValidation(),

    controller.hospitalRegister


)
router.get(
    '/profile',
    // validator.loginValidation(),
    // controller.validate,
    controller.profile

)
router.get(
    '/patientdetail/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.patientDetail

)
router.get(
    '/patientupdate/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.patientUpdate

)
router.get(
    '/alldoctorlist',
    // validator.loginValidation(),
    // controller.validate,
    controller.getALlDoctors

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






module.exports = router