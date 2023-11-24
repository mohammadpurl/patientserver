const express = require('express');
const router = express.Router();
const authRouter = require('./auth')
const userRouter = require('./user')
const formdataRouter = require('./formData')
const error = require('./../middlewares/error.js')
// const adminRouter = require('./admin')
const { isLoggined, getRelatedPatient} = require('./../middlewares/auth.js')
router.use('/auth', authRouter)
router.use('/formdata', formdataRouter)
router.use('/user',isLoggined, getRelatedPatient,  userRouter)

// router.use('/admin',isLoggined, adminRouter)



router.use(error)
module.exports = router;