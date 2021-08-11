const express = require('express')
const router = express.Router()
const {signupExpert, activateExpert, expertRequiresLogin, readExpert, expertLogin, expertLogout, expertsAll} = require('../controller/auth')

// VALIDATION
const {userFormValidator} = require('../validators/auth')
const {runValidation} = require('../validators')
// userFormValidator, runValidation, 

router.post('/signup-expert', signupExpert)
router.post('/activate-expert', activateExpert)
router.get('/user-expert', expertRequiresLogin, readExpert)
router.post('/login-expert', expertLogin)
router.post('/logout-expert', expertLogout)
router.get('/all-experts', expertsAll)

module.exports  = router