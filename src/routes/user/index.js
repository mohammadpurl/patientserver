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


module.exports = router