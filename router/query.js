const express = require("express")
const query = express.Router()
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi');
var fs = require('fs');

// lgKML.get('/search/:location', (req,res) => {
//   const text = `search="${location}"`
//   fs.writeFile('/tmp/query.txt', text,function(err){
//     if(err){
//       console.log(err)
//       res.send({ message: 'Done' })
//     }
//   })
// })
// lgKML.get('/planet/:planet', (req,res) => {
//   const text = `planet="${planet}"`
//   fs.writeFile('/tmp/query.txt', text,function(err){
//     if(err){
//       console.log(err)
//       res.send({ message: 'Done' })
//     }
//   })
// })
// lgKML.get('/flyto/:longitude/:latitude/:range',function(req,res){
//   const text = 'flytoview=<LookAt> <longitude>' + req.params.longitude +'</longitude><latitude>' + req.params.latitude + '</latitude><range>' + req.params.range + '</range></LookAt>'
//   fs.writeFile('/tmp/query.txt', text,function(err){
//     if(err){
//       console.log(err)
//       res.send({ message: 'Done' })
//     }
//   })
// })
//

module.exports = query;
