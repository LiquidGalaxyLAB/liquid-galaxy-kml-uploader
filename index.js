const express = require("express")
const lgKML = express.Router()

/**********************************************
get and set KML into the Liquid Galaxy
***********************************************/
lgKML.get('/kml/',function(){
  console.log("lel")
})
lgKML.get('/kml/list',function(req,res){

})
lgKML.get('/kml/getkml/:id',function(req,res){

})
lgKML.get('/kml/uploadkml/',function(req,res){
  
})
lgKML.get('/kml/setKML/:kml',function(req,res){

})
lgKML.get('/kml/viewsync',function(req,res){

})

module.exports = lgKML;
