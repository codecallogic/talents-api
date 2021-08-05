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
    if(err) return res.status(401).json('Error reading form data')
    console.log(fields)
    console.log(files)
    
    // if(JSON.parse(fields.delete_images).length > 0){
    //   JSON.parse(fields.delete_images).forEach((item) => {
    //     let keyName = new Object()
    //     keyName.Key = item.key
    //     delete_images.push(keyName)
    //   })

    //   let params = {
    //     Bucket: 'fabworkflow-inventory', 
    //     Delete: {
    //     Objects: delete_images, 
    //     Quiet: false
    //     }
    //   }
      
    //   S3.deleteObjects(params, (err, data) => {
    //     if (err) return res.status(401).json('Error uploading files');
    //     console.log(data)
    //   });
    // }
    
    if(files.file){
        let params = {
          Bucket: 'experts',
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
          
          saveData(newUploaded)
        })
    

      const saveData = (data) => {
        fields.photo = data

        console.log(fields)
        
        // const expert = new Expert(fields)

        // expert.save((err, results) => {
        //   console.log(err)
        //   if(err) return res.status(401).json('Error saving data.')
        //   console.log(results)
        //   return res.json(results)
        // })
      }
    }else{
      console.log(fields)
      // const expert = new Expert(fields)

      // expert.save((err, results) => {
      //   console.log(err)
      //   if(err) return res.status(401).json('Error saving data.')
      //   console.log(results)
      //   return res.json(results)
      // })
    }
    
  })
}