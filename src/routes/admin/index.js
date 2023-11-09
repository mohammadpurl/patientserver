const express = require('express');
const router = express.Router();
const controller = require('./controller');
// const validator = require('./validator')


router.get(
    '/', 
  
    controller.users
    
    
    )
router.get(
    '/userDetail', 
    // validator.loginValidation(),
    // controller.validate,
    controller.profile
    
    )


module.exports = router