const express = require('express')
const router = express.Router()
const {messageExpert, messageExpertOnChat, messageClientOnChat} = require('../controller/message')

router.post('/expert', messageExpert)
router.post('/expert-chat', messageExpertOnChat)
router.post('/client-chat', messageClientOnChat)

module.exports  = router