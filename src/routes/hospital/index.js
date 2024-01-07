const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')

router.post(
    '/register',
    validator.hospitalrValidation(),    
    controller.registerHospital
)
router.get(
    '/getHospitalInfo/:id',
    // validator.hospitalrValidation(),    
    controller.getHospitalInfo
)








module.exports = router