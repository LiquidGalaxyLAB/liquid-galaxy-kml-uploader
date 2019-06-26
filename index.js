const express = require("express")
const lgKML = express.Router()
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi');
var fs = require('fs');


var kmlList = []
var currentKml = 0;

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
/***
* KML Builder endpoits
****/
lgKML.get('/kml/Builder/addplacemark',function(req,res){
  // '<Placemark>'
  //   "<name>" "</name>"
  //   '<description>Some Descriptive text.</description>'
  //   '<LookAt>'
  //     '<longitude>'long'</longitude>'
  //     '<latitude>'lat'</latitude>'
  //     '<range>' range '</range>'
  //     '<tilt>' tilt '</tilt>'
  //     '<heading>'2.7'</heading>'
  //   '</LookAt>'
  //   '<Point>'
  //     '<coordinates>' + -90.86948943473118,48.25450093195546,0 +'</coordinates>'
  //   '</Point>'
  // '</Placemark>'
})
lgKML.post('/kml/Builder/Createtour',function(req,res){
  console.log(req.params())
})
lgKML.get('/kml/Builder/addpoint/:tourName',function(req,res){

})
/***
* KML Manage endpoints
****/
lgKML.get('/kml/manage/current',function(req,res){
  res.send(currentKml)
})
lgKML.get('/kml/manage/change/:id',function(req,res){
  console.log(req.params)
  currentKml = req.params.id
  res.send("okay!")
})
lgKML.get('/kml/manage/list',function(req,res){
  res.send(kmlList)
})
lgKML.get('/kml/manage/delete/:id',function(req,res){
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
lgKML.get('/kml/manage/update',function(req,res){
  checkFolder().then(() => {
    console.log(kmlList[0])
    res.send(kmlList)	
  })
	
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


checkFolder()
module.exports = lgKML;
