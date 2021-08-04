const {check} = require('express-validator')

exports.userFormValidator = [
  check('password', 'Password must have a minimum of 8 characters, must contain one uppercase letter, one lowercase letter, and a number').custom( value => {
    let regex = /^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/g
    if(regex.test(value)){
      return true
    }
    return false
  })
]