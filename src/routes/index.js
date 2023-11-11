const express = require('express');
const router = express.Router();
const authRouter = require('./auth')
const userRouter = require('./user')
const error = require('./../middlewares/error.js')
// const adminRouter = require('./admin')
const { isLoggined, verifyRefreshToken} = require('./../middlewares/auth.js')
router.use('/auth', authRouter)

router.use('/user',isLoggined, userRouter)

// router.use('/admin',isLoggined, adminRouter)



router.use(error)
module.exports = router;