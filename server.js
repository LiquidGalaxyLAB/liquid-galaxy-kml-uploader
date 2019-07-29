var express = require('express')
const app = express()
var lgKML = require('./index.js')
var port = process.env.KMLSERVERPORT || 8080
app.use(lgKML)

app.listen(port,function(){
  console.log("API test, listening on port", port )
})
