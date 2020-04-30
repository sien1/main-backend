var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');
//var proveedores = require('./models');

//GET
app.get('/provedores/list', function(req, res){
   model.nuevaPromesa().then((resultado)=>{
      console.log(resultado);
   })
});