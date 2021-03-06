const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema(
{
  message: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  clientID: {
    type: String,
    required: true
  },
  clientName: {
    type: String, 
  },
  clientPhoto: {
    type: String,
  },
  expertName: {
    type: String, 
  },
  expertPhoto: {
    type: String,
  },
  expertEmail: {
    type: String,
  },
  expertID: {
    type: String,
    required: true
  },
  sender: {
    type: String,
  },
  readClient: {
    type: Boolean,
    default: false
  },
  readExpert: {
    type: Boolean,
    default: false
  }
},
{
    timestamps: true
})

module.exports = mongoose.model('Message', Message)