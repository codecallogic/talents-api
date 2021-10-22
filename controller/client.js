const formidable = require("formidable")
const AWS = require('aws-sdk')
const fs = require('fs')
const Client = require('../models/client')

const S3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYIA,
  secretAccessKey: process.env.SECRETKEYIAM,
  region: process.env.AWSREGION
})

exports.clientUpdate = (req, res) => {
  const form = formidable({multiples: true})

  form.parse(req, (err, fields, files) => {
    // console.log(fields)
    console.log(files)

    if(err) return res.status(401).json('Error reading form data')

    for(const key in fields){
      if(!fields[key]) delete fields[key]
    }

    console.log(fields)

    if(fields.delete_photo){
      console.log('PHOTO', fields.delete_photo)
      S3.deleteObject({Bucket: 'discover-talents', Key: fields.delete_photo}, (err, data) => {
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

      const saveDataProfile = (data) => {
        fields.photo = data
        
        let id = fields.id
        Client.findByIdAndUpdate(id, fields, {new: true}, (err, updatedUser) => {
          console.log(err)
          if(err) return res.status(400).json('Could not update user')
          return res.json(updatedUser)
        })
      }
    }else{
      // console.log(fields)
      let id = fields.id
      Client.findByIdAndUpdate(id, fields, {new: true}, (err, updatedUser) => {
        console.log(err)
        if(err) return res.status(400).json('Could not update user')
        return res.json(updatedUser)
      })
    }
  })
}