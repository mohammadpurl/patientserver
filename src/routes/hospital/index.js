const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')

router.post(
    '/register',
    validator.hospitalrValidation(),    
    controller.registerHospital
)

// router.get(
//     '/relatedPractitioner/:id',
//     // validator.paRegisterValidation(),
//     // controller.validate,
//     controller.relatedPractitionerToPatient
// )
// router.get(
//     '/practitioners',
//     // validator.paRegisterValidation(),
//     // controller.validate,
//     controller.getALlDoctors
// )







module.exports = router