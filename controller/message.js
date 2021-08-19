const Expert = require('../models/experts')
const Client = require('../models/client')
const Message = require('../models/message')

exports.messageExpert = (req, res) => {

  const message = new Message({message: req.body.message, name: req.body.name, clientID: req.body.clientID, expertName: req.body.expertName, expertPhoto: req.body.expertPhoto, expertID: req.body.expertID})

  message.save((err, success) => {
    console.log(err)
    if(err) res.status(400).json('Error reading message')
    Client.findById(req.body.clientID, (err, client) => {
      if(err) res.status(400).json('Client could not be found')
      client.messages = [...client.messages, success._id]

      client.save((err, updatedClient) => {
        if(err) res.status(400).json('Could not read message from client')
        let message = success._id

        Expert.findById(req.body.expertID, (err, expert) => {
          if(err) res.status(400).json('Expert could not be found')
          expert.messages = [...expert.messages, message]
          
          expert.save((err, updatedExpert) => {
            if(err) res.status(400).json('Could not send message to expert')
            return res.json(`Message sent to ${updatedExpert.username}`)
          })
        })
      })
    })
  })
}

exports.messageExpertOnChat = (req, res) => {

  const message = new Message({message: req.body.message, name: req.body.name, clientID: req.body.clientID, expertName: req.body.expertName, expertPhoto: req.body.expertPhoto, expertID: req.body.expertID})

  message.save((err, success) => {
    console.log(err)
    if(err) res.status(400).json('Error reading message')
    Client.findById(req.body.clientID, (err, client) => {
      if(err) res.status(400).json('Client could not be found')
      client.messages = [...client.messages, success._id]

      client.save((err, updatedClient) => {
        if(err) res.status(400).json('Could not read message from client')
        let message = success._id

        Expert.findById(req.body.expertID, (err, expert) => {
          if(err) res.status(400).json('Expert could not be found')
          expert.messages = [...expert.messages, message]
          
          expert.save((err, updatedExpert) => {
            if(err) res.status(400).json('Could not send message to expert')

            Client.findById(req.body.clientID).populate('messages').exec((err, user) => {
              if(err) res.status(400).json('Could not get messages')
          
              return res.json(user.messages)
            })
          })
        })
      })
    })
  })
}