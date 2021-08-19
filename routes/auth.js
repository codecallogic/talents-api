const express = require('express')
const router = express.Router()
const {signupExpert, activateExpert, expertRequiresLogin, readExpert, expertLogin, expertLogout, expertsAll, signupClient, activateClient, clientRequiresLogin, readClient, loginClient, clientLogout, clientMessages} = require('../controller/auth')

// VALIDATION
const {userFormValidator} = require('../validators/auth')
const {runValidation} = require('../validators')
// userFormValidator, runValidation, 

// EXPERT
router.post('/signup-expert', signupExpert)
router.post('/activate-expert', activateExpert)
router.get('/user-expert', expertRequiresLogin, readExpert)
router.post('/login-expert', expertLogin)
router.post('/logout-expert', expertLogout)
router.get('/all-experts', expertsAll)

// CLIENT
router.post('/signup-client', signupClient)
router.post('/activate-client', activateClient)
router.get('/user-client', clientRequiresLogin, readClient)
router.post('/login-client', loginClient)
router.post('/logout-client', clientLogout)
router.post('/get-client-messages', clientMessages)

module.exports  = router