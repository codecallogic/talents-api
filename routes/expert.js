const express = require('express')
const router = express.Router()
const {expertCreate} = require('../controller/expert')
const {expertRequiresLogin} = require('../controller/auth')

router.post('/profile-create', expertRequiresLogin, expertCreate)

module.exports  = router