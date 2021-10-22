const express = require('express')
const router = express.Router()
const {clientUpdate} = require('../controller/client')
const {clientRequiresLogin} = require('../controller/auth')

router.post('/update-profile', clientRequiresLogin, clientUpdate)

module.exports  = router