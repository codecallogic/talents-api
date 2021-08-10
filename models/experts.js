const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 6

const Experts = new Schema(
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
  photo_talent: {
    type: Array
  },
  description: {
    type: String,
    require: true
  },
  activity: {
    type: Array
  },
  specialty: {
    type: Array
  },
  location: {
    type: Array
  }
},
{
    timestamps: true
})

Experts.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')) return next()
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash){
      if(err) return next(err)
      user.password = hash
      next()
  })
})

Experts.methods.comparePassword = function(tryPassword, cb){
  bcrypt.compare(tryPassword, this.password, cb)
}

module.exports = mongoose.model('Experts', Experts)