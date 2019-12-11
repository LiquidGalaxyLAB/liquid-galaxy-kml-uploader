const express = require("express")
const path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi');
const fs = require('fs');

class build {

    constructor(path){
      console.log('const', path)
      this.data = path
    }

    router() {
      const route = express.Router()

      route.post('/kml/builder/addplacemark',function(req,res){
        data = req.fields
        kmlMaster.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon,data.scale)
        kmlSlave.addPlacemark(data.id,data.name,data.longitude,data.latitude,data.range,'relativeToGround',data.description,data.icon,data.scale)
        updateKML().then( () => {
            console.log('test')
            res.send({message: true})
          })
      })
      route.post('/kml/builder/Createtour',function(req,res){
      })


      route.put('/kml/builder/editCoodPlacemark',function(req,res){
        data = req.fields
        kmlMaster.editCoodPlacemark(data.id,data.latitude,data.longitude,data.range)
        kmlSlave.editCoodPlacemark(data.id,data.latitude,data.longitude,data.range)
        updateKML()
        res.send({message:'done'})
      })

      route.post('/kml/builder/drawpath',function(req,res){
        data = req.fields
        kmlMaster.createLineString(data.id,data.name,data.path,data.tessellate)
        kmlSlave.createLineString(data.id,data.name,data.path,data.tessellate)
        updateKML()
        res.send({ message : 'done' })
      })

      route.post('/kml/builder/addpoint/:tourName',function(req,res){
        pass
      })

      route.post('/kml/builder/orbit',function(req,res){
        data = req.fields
        kmlMaster.createOrbit(data.id,data.name,data.description,data.latitude,data.longitude,data.range)
        kmlSlave.createOrbit(data.id,data.name,data.description,data.latitude,data.longitude,data.range)
        updateKML()
        res.send({message: 'done'})
      })

      route.post('/kml/builder/addPhoto',function(req,res){
        image = req.files.img
        data = req.fields
        name = 'http://' + process.env.KMLSERVERIP +":"+ process.env.KMLSERVERPORT + '/images/'+ image.name

        kmlMaster.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
        kmlSlave.addGroundOverlay(data.id,data.name,name,data.fCorner,data.sCorner,data.tCorner,data.ftCorner)
        updateKML()
        res.send({ message : 'done' })
      })


      route.post('/kml/builder/concatenate',function(req,res){
        concatenate.push(req.files.kml.path)
        updateKML()
        res.send({message: 'done'})
      })

      route.delete('/kml/builder/deleteTag/:tag/:id',function(req,res){
        kmlMaster.deleteTagById(req.params.tag, req.params.id)
        kmlSlave.deleteTagById(req.params.tag, req.params.id)
        updateKML()
        res.send({message: "done" })
      })

      return route
    }
}

module.exports = build;
