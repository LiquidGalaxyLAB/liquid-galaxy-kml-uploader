var express = require('express')
const app = express()
require('dotenv').config()
var lgKML = require('./index.js')
var port = 5430

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentation.json');
var options = {
  customCss: '.swagger-ui .topbar { display: none }'
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));
app.use(lgKML)

app.listen(port,function(){
  console.log("API test, listening on port", port )
})
