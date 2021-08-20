const Expert = require('../models/experts')
const Client = require('../models/client')
const Message = require('../models/message')
const aws = require('aws-sdk')
const {messageExpertEmail} = require('../templates/messages')

aws.config.update({
  accessKeyId: process.env.ACCESSKEYIAM,
  secretAccessKey: process.env.SECRETKEYIAM,
  region: process.env.AWSREGION
})

const ses = new aws.SES({apiVersion: '2010-12-01'})

exports.messageExpert = (req, res) => {

  const message = new Message({message: req.body.message, name: req.body.name, clientID: req.body.clientID, expertName: req.body.expertName, expertPhoto: req.body.expertPhoto, expertID: req.body.expertID, expertEmail: req.body.expertEmail})

  message.save((err, success) => {
    console.log(err)
    if(err) res.status(400).json('Error reading message')

    const params = messageExpertEmail(req.body.name, req.body.message, req.body.expertEmail)

    const sendEmailOnRegister = ses.sendEmail(params).promise()

    sendEmailOnRegister
      .then( data => {
          console.log('Email submitted on SES', data)
    })
    .catch( err => {
        console.log('SES email on register', err)
    })

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

  const message = new Message({message: req.body.message, name: req.body.name, clientID: req.body.clientID, expertName: req.body.expertName, expertPhoto: req.body.expertPhoto, expertID: req.body.expertID, expertEmail: req.body.expertEmail})

  console.log(req.body)

  message.save((err, success) => {
    console.log(err)
    if(err) res.status(400).json('Error reading message')

    const params = messageExpertEmail(req.body.name, req.body.message, req.body.expertEmail)

    const sendEmailOnRegister = ses.sendEmail(params).promise()

    sendEmailOnRegister
      .then( data => {
          console.log('Email submitted on SES', data)
    })
    .catch( err => {
        console.log('SES email on register', err)
    })
    
    
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

exports.messageClientOnChat = (req, res) => {
  // console.log(req.body)
  const message = new Message({message: req.body.message, name: req.body.name, clientID: req.body.clientID, expertID: req.body.expertID, expertName: req.body.expertName, expertEmail: req.body.expertEmail})

  message.save((err, success) => {
    console.log(err)
    if(err) res.status(400).json('Error reading message')
    Expert.findById(req.body.expertID, (err, expert) => {
      if(err) res.status(400).json('Expert could not be found')
      expert.messages = [...expert.messages, success._id]

      expert.save((err, updatedExpert) => {
        if(err) res.status(400).json('Could not read message from expert')
        let message = success._id

        Client.findById(req.body.clientID, (err, client) => {
          if(err) res.status(400).json('Client could not be found')
          client.messages = [...client.messages, message]
          
          client.save((err, updatedClient) => {
            if(err) res.status(400).json('Could not send message to client')

            Expert.findById(req.body.expertID).populate('messages').exec((err, user) => {
              if(err) res.status(400).json('Could not get messages')
          
              return res.json(user.messages)
            })
          })
        })
      })
    })
  })
}