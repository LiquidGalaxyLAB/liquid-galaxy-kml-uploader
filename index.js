const express = require("express")
const lgKML = express.Router()
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi/');
var fs = require('fs');
var kmlWriter = require('kmlwriter')
const kml = new kmlWriter()
var kmlList = []
var currentKml = 0;
var exec = require('child_process').exec;
var bodyParser = require('body-parser')
lgKML.use( bodyParser.json() );       // to support JSON-encoded bodies
lgKML.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));



/***
* KML Builder endpoits
****/
lgKML.post('/kml/builder/addplacemark',function(req,res){
  console.log(req.query)
})
lgKML.post('/kml/builder/Createtour',function(req,res){
  console.log(req.params())
})
lgKML.post('/kml/builder/addpoint/:tourName',function(req,res){

})


/***
* KML Manage endpoints
****/
lgKML.post('/kml/manage/new',function(req,res){
  kml.startKml(req.query.name)
  kml.createPolygon("pe","pe")
  console.log(kmlDir)
  kml.saveKML(kmlDir)
  res.send("created")
})

lgKML.get('/kml/manage/current',function(req,res){
  res.send(currentKml)
})
lgKML.get('/kml/manage/list',function(req,res){
  res.send(kmlList)
})
lgKML.put('/kml/manage/:id',function(req,res){
  console.log(req.params)
  currentKml = req.params.id
  res.send("okay!")
})
lgKML.put('/kml/manage',function(req,res){
  checkFolder().then(() => {
    console.log(kmlList[0])
    res.send(kmlList)
  })

})
lgKML.delete('/kml/manage/:id',function(req,res){
  if(kmlList.length > 0){
    console.log(kmlList[req.params.id].path)
    fs.unlink(kmlList[req.params.id].path,function(err){
      console.log(err)
    })
    checkFolder().then(() => {
      res.send(kmlList)
    })
  }else{
    res.send(kmlList)

  }

})

/****
*
****/
lgKML.get('/kml/upload/',function(req,res){

})



/****
* the endpoint to sync the kml
****/
lgKML.get('/kml/viewsync',function(req,res){
  res.setHeader('Content-Type', 'text/xml')
  console.log(kmlList[currentKml].path)
  res.sendFile(kmlList[currentKml].path)
  console.log("asking for kml")
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

//suport functions
function checkFolder(){
  kmlList = []
  return new Promise ((resolve,reject) => {
    fs.readdir(kmlDir, function (err, files) {
      files.forEach(function (file) {
        addKML(file)
      });
      resolve()
    });

  })
}
function addKML(kml){
  console.log(kml)
  kmlList.push({
    'id'    : kmlList.length,
    'name'  : kml.split(".js")[0],
    'path'  : path.join(kmlDir,kml)
    })
}



checkFolder()
module.exports = lgKML;
