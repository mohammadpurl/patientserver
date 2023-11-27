const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')


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
router.post(
    '/guardiantopatient',
    // validator.loginValidation(),
    // controller.validate,
    controller.guardianToPatient

)





module.exports = router