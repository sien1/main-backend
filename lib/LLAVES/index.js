var express = require('express');
var app     = module.exports = express.Router();
const llaves = require('../TOOLS/Encriptador/encrypter');

//GET
app.get('/llaves/generar', function(req, res){
   llaves
   .generarParDeLlaves()
   .then(msg => res.status(200).send(msg))
   .catch(error => res.status(500).send(error));
});