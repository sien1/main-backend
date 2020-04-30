var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');
//var proveedores = require('./models');

//GET
app.get('/clientes/anadir/excel', function(req, res){
   model.cargarClientesExcel().then((resultado)=>{
      
   })
});

app.get('/clientes/insertar/excel', function(req, res){
   model.insertarClientes().then((resultado) => {
      
   })
});