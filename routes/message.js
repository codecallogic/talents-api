const express = require('express')
const router = express.Router()
const {messageExpert, messageExpertOnChat} = require('../controller/message')

router.post('/expert', messageExpert)
router.post('/expert-chat', messageExpertOnChat)

module.exports  = router