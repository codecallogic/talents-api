const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 6
const {ObjectId} = mongoose.Schema

const Client = new Schema(
{
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: Array
  },
  messages: [{
    type: ObjectId,
    ref: 'Message'
  }]
},
{
    timestamps: true
})

Client.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')) return next()
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash){
      if(err) return next(err)
      user.password = hash
      next()
  })
})

Client.methods.comparePassword = function(tryPassword, cb){
  bcrypt.compare(tryPassword, this.password, cb)
}

module.exports = mongoose.model('Client', Client)