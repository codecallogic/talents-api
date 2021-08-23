const formidable = require("formidable")
const AWS = require('aws-sdk')
const fs = require('fs')
const Expert = require('../models/experts')

const S3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYIA,
  secretAccessKey: process.env.SECRETKEYIAM,
  region: process.env.AWSREGION
})

exports.expertCreate = (req, res) => {
  // console.log(req)
  const form = formidable({multiples: true})

  form.parse(req, (err, fields, files) => {
    // console.log(fields)
    // console.log(files)
    console.log(err)
    if(err) return res.status(401).json('Error reading form data')

    if(fields.activity.length > 0) fields.activity = JSON.parse(fields.activity)
    if(fields.specialty.length > 0) fields.specialty = JSON.parse(fields.specialty)
    if(fields.location.length > 0) fields.location = JSON.parse(fields.location)

    for(const key in fields){
      if(!fields[key]) delete fields[key]
    }

    if(fields.delete_photo){
      console.log('PHOTO', fields.delete_photo)
      S3.deleteObject({Bucket: 'discover-talents', Key: fields.delete_photo}, (err, data) => {
        console.log(err)
        if (err) return res.status(401).json('Error uploading files');
        console.log(data)
      });
    }

    if(fields.delete_photo_talent){
      console.log('PHOTO_TALENT', fields.delete_photo_talent)
      S3.deleteObject({Bucket: 'discover-talents', Key: fields.delete_photo_talent}, (err, data) => {
        console.log(err)
        if (err) return res.status(401).json('Error uploading files');
        console.log(data)
      });
    }
    
    if(files.file){

      if(files.file.name.split('/')[0] == 'profiles'){
        let params = {
        Bucket: 'discover-talents',
        Key: files.file.name,
        Body: fs.readFileSync(files.file.path),
        ACL: 'public-read',
        ContentType: files.file.type,
        }

        S3.upload(params, (err, data) => {
          console.log(err)
          if(err) return res.status(401).json('Error uploading images to cloud')
          let newUploaded = new Object()
          newUploaded.location = data.Location,
          newUploaded.key = data.Key
          
          saveDataProfile(newUploaded)
        })

      }

      if(files.file.name.split('/')[0] == 'talents'){
        let params = {
        Bucket: 'discover-talents',
        Key: files.file.name,
        Body: fs.readFileSync(files.file.path),
        ACL: 'public-read',
        ContentType: files.file.type,
        }

        S3.upload(params, (err, data) => {
          console.log(err)
          if(err) return res.status(401).json('Error uploading images to cloud')
          let newUploaded = new Object()
          newUploaded.location = data.Location,
          newUploaded.key = data.Key
          
          saveDataTalent(newUploaded)
        })

      }

      const saveDataProfile = (data) => {
        fields.photo = data
        
        let id = fields.id
        Expert.findByIdAndUpdate(id, fields, {new: true}, (err, updatedUser) => {
          console.log(err)
          if(err) return res.status(400).json('Could not update user')
          return res.json(updatedUser)
        })
      }

      const saveDataTalent = (data) => {
        fields.photo_talent = data
        
        let id = fields.id
        Expert.findByIdAndUpdate(id, fields, {new: true}, (err, updatedUser) => {
          console.log(err)
          if(err) return res.status(400).json('Could not update user')
          return res.json(updatedUser)
        })
      }
    }else{
      // console.log(fields)
      let id = fields.id
      Expert.findByIdAndUpdate(id, fields, {new: true}, (err, updatedUser) => {
        console.log(err)
        if(err) return res.status(400).json('Could not update user')
        return res.json(updatedUser)
      })
    }
  })
}