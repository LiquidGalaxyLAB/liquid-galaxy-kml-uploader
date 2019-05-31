const express = require("express")
const lgKML = express.Router()

lgKML.get('/kml/',function(){
  console.log("lel")
})

/***
* KML Builder endpoits
****/
lgKML.get('/kml/Builder/addplacemark',function(req,res){

})
lgKML.get('/kml/Builder/buildtour',function(req,res){

})
lgKML.get('/kml/Builder/addpoint/:tourName',function(req,res){

})
lgKML.get('/kml/setKML/:kml',function(req,res){

})


/****
* the endpoint to sync the kml
****/
lgKML.get('/kml/viewsync',function(req,res){

})

module.exports = lgKML;
