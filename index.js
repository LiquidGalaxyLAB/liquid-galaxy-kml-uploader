const express     = require("express")
const path        = require('path');
const lgKML       = express.Router();
const fs          = require('fs');
const queryRoutes = require('./router/query')
const viewRoutes  = require('./router/viewsync')


global.kml = {
  kmlList: [],
  currentKmlSlave: {},
  currentKmlMaster: {},
  kmlDir: path.join(require('os').homedir(),'/kmlApi/')
}



lgKML.use('/kml/viewsync/',viewRoutes)

var kmlWriter = require('kmlwriter')
const kmlMaster = new kmlWriter()
const kmlSlave = new kmlWriter()

kmlMaster.startKml("initKmlMaster")
kmlSlave.startKml("initKmlSlave")
updateKML()

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
          file.path = global.kml.kmlDir + "images/" + file.name
        }else if(kmlType.includes(file['type']) || file['name'].includes('.kml')){
          file.path = global.kml.kmlDir + file.name
        }
    }
  }
]

lgKML.use(formidableMiddleware({
  keepExtensions: true,

},events));
console.log(global.kml.kmlDir)
lgKML.use('/',express.static(global.kml.kmlDir));

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
  console.log('das')
  data = req.fields
  kmlMaster.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon,data.scale)
  kmlSlave.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon,data.scale)
  updateKML().then( () => {
      console.log('test')
      res.send({message: true})
    })
})
lgKML.post('/kml/builder/Createtour',function(req,res){
})


lgKML.put('/kml/builder/editCoodPlacemark',function(req,res){
  data = req.fields
  kmlMaster.editCoodPlacemark(data.id,data.latitude,data.longitude,data.range)
  kmlSlave.editCoodPlacemark(data.id,data.latitude,data.longitude,data.range)
  updateKML()
  res.send({message:'done'})
})

lgKML.post('/kml/builder/drawpath',function(req,res){
  data = req.fields
  kmlMaster.createLineString(data.id,data.name,data.path,data.tessellate)
  kmlSlave.createLineString(data.id,data.name,data.path,data.tessellate)
  updateKML()
  res.send({ message : 'done' })
})

lgKML.post('/kml/builder/addpoint/:tourName',function(req,res){
  pass
})

lgKML.post('/kml/builder/orbit',function(req,res){
  data = req.fields
  kmlMaster.createOrbit(data.id,data.name,data.description,data.latitude,data.longitude,data.range)
  kmlSlave.createOrbit(data.id,data.name,data.description,data.latitude,data.longitude,data.range)
  updateKML()
  res.send({message: 'done'})
})

lgKML.post('/kml/builder/addPhoto',function(req,res){
  image = req.files.img
  data = req.fields
  // name = fs.readFileSync(image.path)
  // var contentType = 'image/png'
  // var base64=Buffer.from(name.toString('base64'))
  // name = 'data:image/png;base64,'+ base64
  // name = 'http://' + process.env.KMLSERVERIP +":"+ process.env.KMLSERVERPORT + '/images/'+ image.name
  name = 'http://' + process.env.KMLSERVERIP +":"+ process.env.KMLSERVERPORT + '/images/'+ image.name

  kmlMaster.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
  kmlSlave.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
  updateKML()
  res.send({ message : 'done' })
})

lgKML.get('/kml/manage/stopTour',function(req,res){
  var text = 'exittour=true'
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }

  })
  res.send({message: 'done'})
})

lgKML.post('/kml/builder/concatenate',function(req,res){
  concatenate.push(req.files.kml.path)
  // console.log(req.files.kml.path)
  // fs.writeFile('./pre',out,function(err){
  //   if(err){
  //     console.log(err)
  //   }
  // })
  updateKML()
  res.send({message: 'done'})
})

lgKML.delete('/kml/builder/deleteTag/:tag/:id',function(req,res){
  kmlMaster.deleteTagById(req.params.tag, req.params.id)
  kmlSlave.deleteTagById(req.params.tag, req.params.id)
  updateKML()
  res.send({message: "done" })
})

/***
* KML Manage endpoints
****/
lgKML.post('/kml/manage/new',function(req,res){
  startNewKml(req.query.name)
  updateKML()
  checkFolder().then(() => {
    changeCurrentByName(req.query.name)
    res.send({list: global.kml.kmlList})
  })
})

lgKML.get('/kml/manage/current',function(req,res){
  res.send({current: global.kml.currentKmlMaster})
})

lgKML.get('/kml/manage/list',function(req,res){
  res.send({list: global.kml.kmlList})
})
lgKML.get('/kml/manage/clean',function(req,res){
  kmlMaster.startKml("initKmlMaster")
  kmlSlave.startKml("initKmlSlave")
  updateKML()
  cleanScreen()
  res.send({current: global.kml.currentKmlMaster})
})

function cleanScreen(){
    concatenate = []
    checkFolder().then(function(){
      global.kml.kmlList.forEach(function(data,index){
        if(data.name.includes('initKmlMaster')){
          global.kml.currentKmlMaster = global.kml.kmlList[index]
        }else if(data.name.includes('initKmlSlave')){
          global.kml.currentKmlSlave = global.kml.kmlList[index]
        }
      })
    })
}

lgKML.put('/kml/manage/:id',function(req,res){
  currentKml = global.kml.kmlList[req.params.id]
  res.send({message: "done" })
})
lgKML.put('/kml/manage',function(req,res){
  checkFolder().then(() => {
    res.send(global.kml.kmlList)
  })
})


lgKML.get('/kml/manage/balloon/:id/:newState',function(req,res){
  kmlMaster.editBalloonState(req.params.id,req.params.newState)
  updateKML()
  res.send({message : "done"})
})

lgKML.get('/kml/manage/initTour/:name',function(req,res){
  var text = 'playtour=' + req.params.name
  fs.writeFile('/tmp/query.txt', text,function(err){
  if(err){
    console.log(err)
  }

  })
  res.send({message: "done" })
})

lgKML.delete('/kml/manage/:id',function(req,res){
  if(global.kml.kmlList.length > 0){
    fs.unlink(global.kml.kmlList[req.params.id].path,function(err){
      console.log(err)
    })
    checkFolder()
    .then(() => {
      res.send(global.kml.kmlList)
    })
  }else{
    res.send(global.kml.kmlList)
  }

})

lgKML.post('/kml/manage/upload/',function(req,res){
  var kml = req.files.kml
  checkFolder()
  .then(() => {
    changeCurrentByName(kml.name)
    // joinKMLs(global.kml.currentKmlSlave.path)
    // joinKMLs(global.kml.currentKmlSlave.path)
    res.send({message: "done", List: global.kml.kmlList})
  })
  .catch((err) =>{
    console.log(err)
  })

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

  var text = 'flytoview=<LookAt> <longitude>' + req.params.longitude +'</longitude><latitude>' + req.params.latitude + '</latitude><range>' + req.params.range + '</range></LookAt>'
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }
  })
  res.send({ message: 'Done' })

})

lgKML.get('/kml/query/search/:location', (req,res) => {
  const text = `search="${location}"`
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }
    res.send({ message: 'Done' })
  })
})

lgKML.get('/kml/query/planet/:planet', (req,res) => {
  const text = `planet="${planet}"`
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }
    res.send({ message: 'Done' })
  })
})

lgKML.get('/kml/query/flyto/:longitude/:latitude/:range',function(req,res){

  var text = 'flytoview=<LookAt> <longitude>' + req.params.longitude +'</longitude><latitude>' + req.params.latitude + '</latitude><range>' + req.params.range + '</range></LookAt>'
  fs.writeFile('/tmp/query.txt', text,function(err){
    if(err){
      console.log(err)
    }
  })
  res.send({ message: 'Done' })

})




function changeCurrentByName(name){
  name = name.split('.kml')[0]
  checkFolder().then(function(){
    global.kml.kmlList.forEach(function(data,index){
      if(data.name.includes(name)){
        global.kml.currentKmlMaster = global.kml.kmlList[index]
        global.kml.currentKmlSlave = global.kml.kmlList[index]
      }
    })
  })
  joinKMLs(global.kml.currentKmlMaster.path)
  joinKMLs(global.kml.currentKmlSlave.path)


}

//suport functions
function checkFolder(){
  global.kml.kmlList = []
  return new Promise ((resolve,reject) => {
    fs.readdir(global.kml.kmlDir, function (err, files) {
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
  global.kml.kmlList.push({
    'id'    : global.kml.kmlList.length,
    'name'  : kml.split(".kml")[0],
    'path'  : path.join(global.kml.kmlDir,kml)
    })
}

function updateKML(){
  return new Promise(function(resolve, reject) {
    Promise.all([kmlMaster.saveKML(global.kml.kmlDir), kmlSlave.saveKML(global.kml.kmlDir)])
      .then( (values) => {
        console.log('then')
        resolve() })
      .catch( (values) => { reject()})
  });
}

function startNewKml(name){
  kmlMaster.saveKML(name)
  kmlSlave.saveKML(name)
}

function joinKMLs(CurrentPath){
  var out = fs.readFileSync(CurrentPath).toString()
  out = out.replace(/<\/Document[^>]*>|<\/kml[^>]*>/g,"")
  concatenate.forEach(function(cKml){
    cKml = fs.readFileSync(cKml).toString().replace(/<\?{0,1}\/{0,1}[kx]{1}ml[^>]*>/g,'')
    cKml = cKml.replace(/<\/Document/g,'</Folder')
    cKml = cKml.replace(/<Document/g,'<Folder')
    out += cKml
  })
  out += '</Document></kml>'
  // CurrentPath
  fs.writeFile(CurrentPath,out,function(err){
    if(err){
      console.log(err)
    }
  })
}



cleanScreen()
/***
*export
**/
module.exports = lgKML;
