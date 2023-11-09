const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validator = require('./validator')

// router.post('/login',(req,res)=>{
//     res.send("login")
// })
router.post(
    '/register',
    validator.registerValidation(),
    controller.validate,
    controller.register

)
router.post(
    '/login',
    validator.loginValidation(),
    controller.validate,
    controller.login)

router.post(
    '/logout',
    controller.logout)

router.post(
    '/token',
    controller.verifyRefreshToken,
    controller.GetAccessToken)


module.exports = router