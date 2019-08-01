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
var concatenate = [];

var exec = require('child_process').exec;
var bodyParser = require('body-parser')


const formidableMiddleware = require('express-formidable');
const acceptedImageTypes = ['image/gif', 'image/jpg' ,'image/jpeg', 'image/png'];
const kmlType = ['text/xml', 'application/vnd.google-earth.kml+xml'];
const events = [
  {
    event: 'fileBegin',
    action: function(req,res,next,name,file){
        if(acceptedImageTypes.includes(file['type']) || file['name'].includes('.png')){
          file.path = kmlDir + "images/" + file.name
        }else if(kmlType.includes(file['type']) || file['name'].includes('.kml')){
          file.path = kmlDir + file.name
        }
    }
  }
]

lgKML.use(formidableMiddleware({
  keepExtensions: true,

},events));

lgKML.use('/',express.static(kmlDir));

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
  kml.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon,data.scale)
  kml.saveKML(kmlDir)
    .then(() =>{
      res.send({message: true})
    })
    .catch(()=>{
      res.send({message: false})
    })
})
lgKML.post('/kml/builder/Createtour',function(req,res){
  console.log(req.params())
})

lgKML.post('/kml/builder/addpoint/:tourName',function(req,res){
  pass
})

lgKML.post('/kml/builder/addPhoto',function(req,res){
  image = req.files.img
  data = req.fields
  // name = fs.readFileSync(image.path)
  // var contentType = 'image/png'
  // var base64=Buffer.from(name.toString('base64'))
  // name = 'data:image/png;base64,'+ base64
  name = 'http://' + process.env.KMLSERVERIP +":"+ process.env.KMLSERVERPORT + '/images/'+ image.name
  kml.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
  kml.saveKML(kmlDir)
  res.send({ message : 'done' })
})

/***
* KML Manage endpoints
****/
lgKML.post('/kml/manage/new',function(req,res){
  kml.startKml(req.query.name)
  kml.saveKML(kmlDir)
  checkFolder().then(() => {
    changeCurrentByName(req.query.name)
    res.send(kmlList)
  })
})

lgKML.get('/kml/manage/current',function(req,res){
  res.send(currentKml)
})

lgKML.get('/kml/manage/current',function(req,res){
  res.send(currentKml)
})

lgKML.get('/kml/manage/list',function(req,res){
  res.send(kmlList)
})
lgKML.get('/kml/manage/clean',function(req,res){
  kml.startKml("initKml")
  changeCurrentByName("initKml")
  kml.saveKML((kmlDir))
  res.send(currentKml)
})
lgKML.put('/kml/manage/:id',function(req,res){
  console.log(req.params)
  currentKml = kmlList[req.params.id]
  res.send({message: "done" })
})
lgKML.put('/kml/manage',function(req,res){
  checkFolder().then(() => {
    res.send(kmlList)
  })
})


lgKML.get('/kml/manage/balloon/:id/:newState',function(req,res){
  kml.editBalloonState(req.params.id,req.params.newState)
  kml.saveKML(kmlDir)
  res.send({message : "done"})
})


// lgKML.post('/kml/builder/concatenate',function(req,res){
//
// })

lgKML.delete('/kml/builder/deleteTag/:tag/:id',function(req,res){
  console.log(req.params)
  kml.deleteTagById(req.params.tag, req.params.id)
  res.send({message: "done" })

})

lgKML.get('/kml/manage/initTour/:name',function(req,res){
  var text = 'playtour=' + req.params.name
  fs.writeFile('/tmp/query.txt', text,function(err){
    console.log(err)
  })
  req.send({message: "done" })
})

lgKML.get('/kml/manage/initTour/:name',function(req,res){
  var text = 'playtour=' + req.params.name
  fs.writeFile('/tmp/query.txt', text,function(err){
    console.log(err)
  })
  req.send({message: "done" })
})

lgKML.delete('/kml/manage/:id',function(req,res){
  if(kmlList.length > 0){
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
  checkFolder()
  .then(() => {
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
    exec(req.params.exec, function(error, stdout, stderr){
        res.send(stdout);
    });
})

lgKML.get('/kml/flyto/:longitude/:latitude/:range',function(req,res){

  var text = 'flytoview=<LookAt><longitude>' + req.params.longitude +'</longitude><latitude>' + req.params.latitude + '</latitude><range>' + req.params.range + '</range></LookAt>'
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }
  })
  res.send({ message: 'Done' })

})


function changeCurrentByName(name){
  checkFolder().then(function(){
    kmlList.forEach(function(data,index){
      if(data.name.includes(name)){
        currentKml = kmlList[index]
      }
    })
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
  changeCurrentByName('initKml')
})

/***
*export
**/
module.exports = lgKML;
