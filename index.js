const express = require("express")
const lgKML = express.Router()
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi');
var fs = require('fs');
var kmlWriter = require('kmlWriter')
const kml = kmlWriter()

var kmlList = []
var currentKml = 0;


/***
* KML Builder endpoits
****/
lgKML.post('/kml/builder/addplacemark',function(req,res){

})
lgKML.post('/kml/builder/Createtour',function(req,res){
  console.log(req.params())
})
lgKML.post('/kml/builder/addpoint/:tourName',function(req,res){

})


/***
* KML Manage endpoints
****/
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
