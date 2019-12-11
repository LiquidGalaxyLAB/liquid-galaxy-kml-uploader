const express = require("express")
const query = express.Router()
var path = require('path');
const kmlDir = path.join(require('os').homedir(),'/kmlApi');
var fs = require('fs');



module.exports = query;
