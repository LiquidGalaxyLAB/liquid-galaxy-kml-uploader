const express = require("express")
const lgKML = express.Router()
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi/');
var fs = require('fs');
var kmlWriter = require('kmlwriter')
const kml = new kmlWriter()
kml.startKml("initKml")
kml.saveKML(kmlDir)
var kmlList = []
var currentKml = {};
var exec = require('child_process').exec;
var bodyParser = require('body-parser')
const formidableMiddleware = require('express-formidable');
const acceptedImageTypes = ['image/gif', 'image/jpg' ,'image/jpeg', 'image/png'];
const kmlType = ['text/xml', 'application/vnd.google-earth.kml+xml'];
const events = [
  {
    event: 'fileBegin',
    action: function(req,res,next,name,file){
        console.log(file)
        if(acceptedImageTypes.includes(file['type']) || file['name'].includes('.png')){
          file.path = "/home/xemyst/kmlApi/images/" + file.name
        }else if(kmlType.includes(file['type']) || file['name'].includes('.kml')){
          file.path = "/home/xemyst/kmlApi/" + file.name
        }
    }
  }
]

lgKML.use(formidableMiddleware({
  keepExtensions: true,

},events));

lgKML.use('/',express.static('/home/xemyst/kmlApi/'));

lgKML.use( bodyParser.json() );       // to support JSON-encoded bodies
lgKML.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))
lgKML.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// lgKML.use(bodyParser() );



/***
* KML Builder endpoits
****/

/****
*  params  id,name,lon,lat,range, altMode = 'relativeToGround', description = '', icon= ''
****/
lgKML.post('/kml/builder/addplacemark',function(req,res){
  data = req.fields
  console.log(req.fields)
  kml.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon)
  kml.saveKML(kmlDir)
    .then(() =>{
      res.send(true)
    })
    .catch(()=>{
      res.send(false)
    })
})
lgKML.post('/kml/builder/Createtour',function(req,res){
  console.log(req.params())
})
lgKML.post('/kml/builder/addpoint/:tourName',function(req,res){

})

lgKML.post('/kml/builder/addPhoto',function(req,res){
  image = req.files.image
  data = req.fields
  console.log("data" , data, "images" ,req.files)
  // name = fs.readFileSync(image.path)
  // var contentType = 'image/png'
  // var base64=Buffer.from(name.toString('base64'))
  // name = 'data:image/png;base64,'+ base64
  name = 'http://8005e1e0.ngrok.io/images/'+ image.name
  kml.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
  kml.saveKML(kmlDir)
  res.send("done")
})

/***
* KML Manage endpoints
****/
lgKML.post('/kml/manage/new',function(req,res){
  console.log(req)
  console.log(req.fields.name)
  kml.startKml(req.fields.name)
  kml.saveKML(kmlDir)
  checkFolder().then(() => {
    res.send(kmlList)
  })
})

lgKML.get('/kml/manage/current',function(req,res){
  res.send(currentKml)
})
lgKML.get('/kml/manage/list',function(req,res){
  res.send(kmlList)
})
lgKML.get('/kml/manage/clean',function(req,res){
  console.log(req)
  kml.startKml("initKml")
  changeCurrentByName("initKml")
  kml.saveKML((kmlDir))
  res.send(currentKml)
})
lgKML.put('/kml/manage/:id',function(req,res){
  console.log(req.params)
  currentKml = kmlList[req.params.id]
  res.send("okay!")
})
lgKML.put('/kml/manage',function(req,res){
  checkFolder().then(() => {
    res.send(kmlList)
  })

})
lgKML.delete('/kml/builder/deleteTag/:tag/:id',function(req,res){
  console.log(req)
  res.send("ok")

})

lgKML.delete('/kml/manage/:id',function(req,res){
  if(kmlList.length > 0){
    console.log(kmlList[req.params.id].path)
    fs.unlink(kmlList[req.params.id].path,function(err){
      console.log(err)
    })
    checkFolder()
    .then(() => {
      res.send(kmlList)
    })
  }else{
    res.send(kmlList)

  }

})

/****
*
****/
lgKML.post('/kml/manage/upload/',function(req,res){
  var kml = req.files.kml
  console.log(req.files, req.fields)
  checkFolder()
  .then(() => {
    console.log(kml.name)
    changeCurrentByName(kml.name)
    res.send(kmlList)
  })
  .catch((err) =>{
    console.log(err)
  })


})



/****
* the endpoint to sync the kml
****/
lgKML.get('/kml/viewsync',function(req,res){
  // console.log("request!")
  res.setHeader('Content-Type', 'text/xml')
  // console.log(currentKml.path)
  res.sendFile(currentKml.path)
})

/***
* exec the scripts
***/

lgKML.get('/system/:exec',function(req,res){
    console.log(req.params)
    exec(req.params.exec, function(error, stdout, stderr){
        res.send(stdout);
    });
})

function changeCurrentByName(name){
  checkFolder().then(function(){
    kmlList.forEach(function(data,index){
      console.log(data.name, name)
      if(data.name.includes(name)){
        currentKml = kmlList[index]
      }
    })
    console.log(currentKml)
  })

}

//suport functions
function checkFolder(){
  kmlList = []
  return new Promise ((resolve,reject) => {
    fs.readdir(kmlDir, function (err, files) {
      files.forEach(function (file) {
        if(file.substr(-4) === '.kml') {
          addKML(file)
        }
      });

      resolve()
    });
  })
}
function addKML(kml){
  kmlList.push({
    'id'    : kmlList.length,
    'name'  : kml.split(".js")[0],
    'path'  : path.join(kmlDir,kml)
    })
}

checkFolder().then(function(){
  currentKml = kmlList[0]
})
module.exports = lgKML;
