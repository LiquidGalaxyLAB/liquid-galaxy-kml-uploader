const express = require("express")
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi');
var fs = require('fs');

class query {

    constructor(path){
      console.log('const', path)
      this.data = path
    }

    router() {
      const route = express.Router()

      route.get('/search/:location', (req,res) => {
        const text = `search="${req.params.location}"`
        fs.writeFile('/tmp/query.txt', text,function(err){
          if(err){
            console.log(err)
            res.status(500).send({msg: 'internal error'})
          }
          res.send({ message: 'Done' })
        })
      })
      route.get('/planet/:planet', (req,res) => {
        const text = `planet="${req.params.planet}"`
        fs.writeFile('/tmp/query.txt', text,function(err){
          if(err){
            console.log(err)
            res.status(500).send({msg: 'internal error'})
          }
          res.send({ message: 'Done' })
        })
      })
      route.get('/flyto/:longitude/:latitude/:range',function(req,res){
        const text = 'flytoview=<LookAt> <longitude>' + req.params.longitude +'</longitude><latitude>' + req.params.latitude + '</latitude><range>' + req.params.range + '</range></LookAt>'
        fs.writeFile('/tmp/query.txt', text,function(err){
          if(err){
            console.log(err)
            res.status(500).send({msg: 'internal error'})
          }
          res.send({ message: 'Done' })
        })
      })

      return route
    }
}

module.exports = query;
