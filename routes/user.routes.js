const express = require("express")
const { handleUserSignup } = require("../controllers/user.controllers")
const {handleUserLogin} = require("../controllers/user.controllers")
const router = express.Router()

router.post('/', handleUserSignup)
router.post("/login", handleUserLogin);


module.exports = router