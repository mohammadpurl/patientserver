const express = require('express');
const router = express.Router();
const controller = require('./controller');
// const validator = require('./validator')


router.get(
    '/', 
  
    controller.dashboard
    
    
    )
router.get(
    '/profile', 
    // validator.loginValidation(),
    // controller.validate,
    controller.profile
    
    )


module.exports = router