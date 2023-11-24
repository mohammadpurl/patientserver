const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')


// router.post(
//     '/patientregister',
//     // validator.paRegisterValidation(),
//     // controller.validate,
//     controller.patientRegister
// )

router.post(
    '/register',
    validator.dgRegisterValidation(),
    // controller.validate,
    controller.registerPractitioner
)

router.get(
    '/relatedPractitioner/:id',
    // validator.paRegisterValidation(),
    // controller.validate,
    controller.relatedPractitionerToPatient
)
// router.post(
//     '/hospitalregister',
//     validator.hospitalValidation(),

//     controller.hospitalRegister


// )
// router.get(
//     '/profile',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.profile

// )
// router.get(
//     '/patientdetail/:id',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.patientDetail

// )
// router.get(
//     '/patientupdate/:id',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.patientUpdate

// )
// router.get(
//     '/alldoctorlist',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.getALlDoctors

// )
// router.post(
//     '/guardiantopatient',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.guardianToPatient

// )
// router.post(
//     '/medications',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.InsertMedicationToPatient

// )
// router.get(    
//     '/medications/:id',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.getAllMedication

// )
// router.post(
//     '/savelastthirty',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.InsertLastThirtyToPatient

// )
// router.post(
//     '/savemedicalhistopatient',
//     // validator.loginValidation(),
//     // controller.validate,
//     controller.InsertMedicalHisToPatient

// )






module.exports = router