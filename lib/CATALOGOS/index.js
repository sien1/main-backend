var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');
//var proveedores = require('./models');

//GET
app.get('/catalogos/clientes', function(req, res){
   model.catalogoClientes(req.query.search)
   .then((response)=>{
       res.status(200).send({response});
   })
   .catch((err)=>{
       res.status(500).send(err);
   });
});


app.get('/catalogos/proyectos', function(req, res){
   model.catalogoProyectos(req.query.search)
   .then((response) => {
        res.status(200).send({response});
   })
   .catch((err)=>{
        res.status(500).send(err);
   });
});

app.get('/catalogos/empleados', function(req, res){
    model.catalogoEmpleados(req.query.search)
    .then((response) => {
         res.status(200).send({response});
    })
    .catch((err)=>{
         res.status(500).send(err);
    });
 });
 