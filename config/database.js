const mongoose = require('mongoose')

mongoose.connect(process.env.ATLAS_URI, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
)

const db = mongoose.connection

db.on('connected', function(){
  console.log(`Connected to mongoDB database at ${db.host} : ${db.port} : database ${db.name}`)
})