const express = require("express")

class view {

    constructor(path){
      console.log('const', path)
      this.data = path
    }

    router() {
      const route = express.Router()

      route.get('/slave',(req,res) => {
        res.setHeader('Content-Type', 'text/xml')

        res.sendFile(this.data.slave.path)
      })
      route.get('/master',(req,res) => {
        console.log('call' , this.data)
        res.setHeader('Content-Type', 'text/xml')
        res.sendFile(this.data.master.path)
      })
      return route
    }
}




module.exports = view;
