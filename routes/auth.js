const express = require('express')
const router = express.Router()
const {signupExpert, activateExpert, expertRequiresLogin, readExpert, expertLogin, expertLogout, expertsAll, expertMessages, expertMessagesInit, signupClient, activateClient, clientRequiresLogin, readClient, loginClient, clientLogout, clientMessages, clientMessagesInit} = require('../controller/auth')

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
router.post('/get-expert-messages', expertMessages)
router.post('/get-expert-messages-init', expertMessagesInit)

// CLIENT
router.post('/signup-client', signupClient)
router.post('/activate-client', activateClient)
router.get('/user-client', clientRequiresLogin, readClient)
router.post('/login-client', loginClient)
router.post('/logout-client', clientLogout)
router.post('/get-client-messages', clientMessages)
router.post('/get-client-messages-init', clientMessagesInit)

module.exports  = router