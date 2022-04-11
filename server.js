const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Client = require('./models/client')
const Expert = require('./models/experts')
const Message = require('./models/message')
const aws = require('aws-sdk')
const {messageExpertEmail} = require('./templates/messages')

require('dotenv').config()
require('./config/database')

aws.config.update({
  accessKeyId: process.env.ACCESSKEYIAM,
  secretAccessKey: process.env.SECRETKEYIAM,
  region: process.env.AWSREGION
})

const ses = new aws.SES({apiVersion: '2010-12-01'})


const app = express()

// ROUTES
const authRoutes = require('./routes/auth')
const expertRoutes = require('./routes/expert')
const messageRoutes = require('./routes/message')
const clientRoutes = require('./routes/client')

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json())
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))

// API
app.use('/api/auth', authRoutes)
app.use('/api/expert', expertRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/client', clientRoutes)

const port = process.env.PORT
const server = app.listen(port, () => console.log(`Server is running on port ${port}`))

const io = require('socket.io')(server, {cookie: false})

io.on('connection', (socket) => {
  socket.on('client-message-expert', ({name, message, clientName, clientPhoto, expertName, expertPhoto, expertID, expertEmail, clientID, sender, readClient}, callback) => {

    // console.log(name, message, expertName, expertPhoto, expertID, expertEmail, clientID, sender)

    const newMessage = new Message({message: message, name: name, clientID: clientID, clientName: clientName, clientPhoto: clientPhoto, expertName: expertName, expertPhoto: expertPhoto, expertID: expertID, expertEmail: expertEmail, sender: sender, readClient: readClient})

    newMessage.save((err, success) => {
      console.log(err)
      if(err) return socket.emit('error', 'Error reading message')

      // const params = messageExpertEmail(name, message, expertEmail)

      // const sendEmailOnRegister = ses.sendEmail(params).promise()

      // sendEmailOnRegister
      //   .then( data => {
      //       console.log('Email submitted on SES', data)
      // })
      // .catch( err => {
      //     console.log('SES email on register', err)
      // })
      
      
      Client.findById(clientID, (err, client) => {
        if(err) return socket.emit('error', 'Client could not be found')
        client.messages = [...client.messages, success._id]

        client.save((err, updatedClient) => {
          if(err) return socket.emit('error', 'Could not read message from client')
          let message = success._id

          Expert.findById(expertID).populate('messages').exec((err, expert) => {
            if(err) return socket.emit('error', 'Expert could not be found')
            expert.messages = [...expert.messages, message]
            
            expert.save((err, updatedExpert) => {
              if(err) return socket.emit('error', 'Could not send message to expert')
              
              Client.findById(clientID).populate('messages').exec((err, user) => {
                if(err) return socket.emit('error', 'Could not get messages')
                Expert.findById(expertID).populate('messages').exec((err, newExpert) => {
                  if(err) return socket.emit('error', 'Could not get messages')
                  io.emit(expertID, {messages: newExpert.messages, clientName: clientName})
                })
                return callback(user.messages)
              })
            })
          })
        })
      })
    })
  })

  socket.on('expert-message-client', ({name, message, clientName,expertName, expertPhoto, expertID, expertEmail, clientID, sender, readExpert}, callback) => {
    // console.log(name, message, expertName, expertPhoto, expertID, expertEmail, clientID, sender)

    const newMessage = new Message({name: name, message: message, clientID: clientID, expertID: expertID, clientName: clientName, expertName: expertName, expertEmail: expertEmail, expertPhoto: expertPhoto, sender: sender, readExpert: readExpert})

    newMessage.save((err, success) => {
      console.log(err)
      if(err) return socket.emit('error', 'Error reading message')
      Expert.findById(expertID, (err, expert) => {
        if(err) return socket.emit('error', 'Expert could not be found')
        expert.messages = [...expert.messages, success._id]

        expert.save((err, updatedExpert) => {
          if(err) return socket.emit('error', 'Could not read message from expert')
          let message = success._id

          Client.findById(clientID, (err, client) => {
            if(err) return socket.emit('error', 'Client could not be found')
            client.messages = [...client.messages, message]
            
            client.save((err, updatedClient) => {
              if(err) return socket.emit('error', 'Could not send message to client')

              Expert.findById(expertID).populate('messages').exec((err, user) => {
                if(err) return socket.emit('error', 'Could not get messages')
                Client.findById(clientID).populate('messages').exec((err, newClient) => {
                  if(err) return socket.emit('error', 'Could not get messages')
                  io.emit(clientID, {messages: newClient.messages, expertName: expertName})
                })
                return callback(user.messages)
              })
            })
          })
        })
      })
    })
  })
})
