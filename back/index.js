var cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ 
limit: '50mb',
parameterLimit: 100000,
extended: true  }));
app.use(bodyParser.json({
    limit: '50mb'
  }));
app.use(methodOverride('_method'));



var PORT = process.env.PORT || 5000 ;


mongoose
  .connect(
    'mongodb+srv://hmedhappy:yasmineahmed15@cluster0.5ayti.mongodb.net/azizaDB?retryWrites=true&w=majority'
    ,
       {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log("DB Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});


const conn = mongoose.createConnection('mongodb+srv://hmedhappy:yasmineahmed15@cluster0.5ayti.mongodb.net/azizaDB?retryWrites=true&w=majority');
var gfs;
conn.once('open', () => {
  // Init 
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Stockage
const storage = new GridFsStorage({
  url: 'mongodb+srv://hmedhappy:yasmineahmed15@cluster0.5ayti.mongodb.net/azizaDB?retryWrites=true&w=majority',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


app.get('/',(req,res)=>{
    res.send('hello ia m the server')
})

app.post('/upload',upload.any('file'),(req,res)=>{

  gfs.files.find().toArray((err, files)=>{
    if(!files || files.length ===0 || err){
      return res.status(404).json({
        err : 'no files exist'
      });
    }
    return res.json({files})
 });

  
})

app.get('/getaudio',(req,res)=>{
  gfs.files.findOne({filename : '5f128041c7150b67f06f1e5cb4fec06c'},(err,file)=>{
    if(!file || file.length===0){
      return res.status(404).json({
        err:'no file exist'
      });
    }
    if(file.contentType==='audio/wav'){
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }else{
      res.status(404).json({
        err:"not an image"
      })
    }


  })
})



app.listen(PORT , ()=>console.log(`server connected at ${PORT}`))