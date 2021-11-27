var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');


//OBTENER TODOS LOS PROYECTOS POR PERFIL
app.get('/proyectos/all', (req, res) => {
   model.getProyectos(req.query)
   .then((resultado) => {
      return res.status(200).send({resultado})
   })
   .catch(err => res.status(500).send({err}));
})

//ANADIR PROYECTOS
app.post('/proyectos/proyecto', (req, res) => {
   
   model.insertarProyecto(req)
   .then((resultado) => {
      return res.status(200).send({resultado});
   })
   .catch(err => res.status(500).send({err}));
});


//ACTULIZAR PROYECTOS CON ESTATUS


//ACTUALIZAR DATOS DE PROYECTO
