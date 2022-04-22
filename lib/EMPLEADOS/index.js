var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');
//var proveedores = require('./models');

//GET
app.get('/empleados/all', function(req, res) {
   model.getAllEmpleados()
   .then((resultado) => {
      return res.status(200).send({resultado})
   })
   .catch(err => res.status(500).send({err}));
});

app.get('/empleados/insertar/excel', function(req, res){
   model.insertarEmpleadosExcel().then((resultado)=>{
      console.log(resultado);
   })
});

app.get('/empleados/empleado', async function(req, res){
   
});


