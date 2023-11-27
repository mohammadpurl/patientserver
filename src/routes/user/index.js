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
router.delete(
    '/patients/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.patientDelete

)


router.get(
    '/visits/:id',
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

router.get(
    '/profile',
    // validator.loginValidation(),
    // controller.validate,
    controller.profile

)



router.post(
    '/medications',
    // validator.loginValidation(),
    // controller.validate,
    controller.insertMedicationToPatient

)
router.get(
    '/medications/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.getAllMedication

)

router.post(
    '/lastthirty',
    // validator.loginValidation(),
    // controller.validate,
    controller.insertLastThirtyToPatient

)
router.get(
    '/lastthirty/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.getAllLastThirty

)

router.post(
    '/medicalhistory',
    // validator.loginValidation(),
    // controller.validate,
    controller.insertMedicalHisToPatient

)

router.get(
    '/medicalhistory/:id',
    // validator.loginValidation(),
    // controller.validate,
    controller.getAllMedicalHistory

)





module.exports = router