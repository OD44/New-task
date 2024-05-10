const express = require('express')
const { forgetPassword, updatePassword, updateUserAccount, getAllUsers, getSingleUser } = require('../Controller/auth')
const { isLoggedIn } = require('../Middleware/auth')



const router = express.Router()

router.route("/updateuser/:userId").patch([isLoggedIn], updateUserAccount)
router.route("/users").get([isLoggedIn], getAllUsers)
router.route("/users/:userId").get([isLoggedIn], getSingleUser)
// router.route("/reset").post([isLoggedIn],forgetPassword)
// router.route("/update/:token").post(updatePassword)

module.exports = router