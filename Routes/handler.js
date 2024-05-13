const express = require('express')
const { updateUserAccount, getAllUsers, getSingleUser, deleteUser } = require('../Controller/controller')
const { isLoggedIn } = require('../Middleware/auth')



const router = express.Router()

router.route("/update-user/:userId").patch([isLoggedIn], updateUserAccount)
router.route("/users").get([isLoggedIn], getAllUsers)
router.route("/users/:userId").get([isLoggedIn], getSingleUser)
router.route("/delete-user/:userId").delete([isLoggedIn], deleteUser)


module.exports = router