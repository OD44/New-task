const express = require('express')
const { updateUserAccount, getAllUsers, getSingleUser, deleteUser } = require('../Controller/controller')
const { isLoggedIn } = require('../Middleware/auth')



const router = express.Router()

router.route("/updateuser/:userId").patch([isLoggedIn], updateUserAccount)
router.route("/users").get([isLoggedIn], getAllUsers)
router.route("/users/:userId").get([isLoggedIn], getSingleUser)
router.route("/users/:userId").delete([isLoggedIn], deleteUser)

// router.route("/reset").post([isLoggedIn],forgetPassword)
// router.route("/update/:token").post(updatePassword)

module.exports = router