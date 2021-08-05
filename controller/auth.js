const Expert = require('../models/experts')
const aws = require('aws-sdk')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const {signupExpertEmail} = require('../templates/auth')

aws.config.update({
  accessKeyId: process.env.ACCESSKEYIAM,
  secretAccessKey: process.env.SECRETKEYIAM,
  region: process.env.AWSREGION
})

const ses = new aws.SES({apiVersion: '2010-12-01'})

exports.signupExpert = (req, res) => {
  Expert.findOne({email: req.body.email}, (err, user) => {
    if(user) return res.status(400).json('User with that email already exists')

      const token = jwt.sign({username: req.body.username, email: req.body.email, password: req.body.password}, process.env.JWT_ACCOUNT_SIGNUP, {expiresIn: '24hr'})

      const params = signupExpertEmail(req.body.email, token)

      const sendEmailOnRegister = ses.sendEmail(params).promise()

      sendEmailOnRegister
        .then( data => {
            console.log('Email submitted on SES', data)
            return res.json(`Email sent to ${req.body.email}.`)
      })
      .catch( err => {
          console.log('SES email on register', err)
          return res.status(400).json('We could not verify your email please try again')
      })
  })
}

exports.activateExpert = (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_ACCOUNT_SIGNUP, function(err, decoded){
    console.log(err)
    if(err) return res.status(401).json('Expired link, please try again.')
    
    const {username, email, password} = decoded

    Expert.findOne({email}, (err, user) => {
      console.log(err)
      if(user) return res.status(401).json(`User with the email ${email} already exists.`)

      const new_expert = new Expert({username, email, password})

      new_expert.save((err, results) => {
        if(err){
          console.log(err)
          return res.status(401).json('Could not save user.')
        }

        console.log(results)

        const tokenExpert = jwt.sign({username: results.username, email: results.email}, process.env.JWT_ACCOUNT_CONFIRM, {expiresIn: '3hr', algorithm: 'HS256'})
        const expert = {username: results.username, email: results.email}
        
        return res.status(202).cookie(
            "expertToken", tokenExpert, {
            sameSite: 'strict',
            expires: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
            httpOnly: true
        })
        .cookie("expert", JSON.stringify(expert), {
          sameSite: 'strict',
          expires: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
          httpOnly: true
        })
        .send(expert)
      })
    })
  })
}

exports.expertRequiresLogin = expressJWT({ secret: process.env.JWT_ACCOUNT_LOGIN, algorithms: ['HS256']})

exports.readExpert = (req, res) => {
  console.log(req.user)
  Expert.findOne({email: req.user.email}, (err, user) => {
    console.log(err)
    if(err) return res.status(401).json('User does not exists in our records.')
    // console.log(user)
    return res.json({username: user.username, email: user.email})
  })
}

exports.expertLogin = (req, res) => {
  console.log(req.body)
  Expert.findOne({$or: [{username: req.body.username}, {email: req.body.username}]}, (err, user) => {
    console.log(err)
    if(err) return res.status(400).json('You do not have an account please sign up')
    if(!user) return res.status(400).json('You do not have an account please sign up')
    console.log(user)

    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log(err)
      if(err) return res.status(400).json('Error reading your password')

        if(isMatch){
        const tokenExpert = jwt.sign({username: user.username, email: user.email}, process.env.JWT_ACCOUNT_LOGIN, {expiresIn: '3hr', algorithm: 'HS256'})
        const expert = {username: user.username, email: user.email}
        
        return res.status(202).cookie(
          "expertToken", tokenExpert, {
          sameSite: 'strict',
          expires: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
          httpOnly: true
        })
        .cookie("expert", JSON.stringify(expert), {
          sameSite: 'strict',
          expires: new Date(new Date().getTime() + (3 * 60 * 60 * 1000)),
          httpOnly: true
        })
        .send(expert)
      }else{
        return res.status(401).json('Incorrect password.')
      }

    })
  })
}