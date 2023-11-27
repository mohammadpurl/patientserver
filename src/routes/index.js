const express = require('express');
const router = express.Router();
const authRouter = require('./auth')
const userRouter = require('./user')
const practitionerRouter = require('./doctor')
const formdataRouter = require('./formData')
const error = require('./../middlewares/error.js')
const guardianRouter = require('./guardian')
const { isLoggined, getRelatedPatient} = require('./../middlewares/auth.js')
router.use('/auth', authRouter)
router.use('/formdata', formdataRouter)
router.use('/user',isLoggined, getRelatedPatient,  userRouter)
router.use('/practitioner',isLoggined, getRelatedPatient,  practitionerRouter)
router.use('/guardian',isLoggined, getRelatedPatient,  guardianRouter)
// router.use('/admin',isLoggined, adminRouter)



router.use(error)
module.exports = router;