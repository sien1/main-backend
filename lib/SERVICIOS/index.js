const { randomFillSync } = require('crypto');
var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');

//GET
app.get('/servicios/byproyecto', async (req, res) => {

   try {
      const servicios = await model.getServiciosByProyecto(req.query.idProyecto);
      
      res.status(200).send(servicios);
   } catch (error) {
      res.status(401).send(error);
   } 
});


//POST ll
app.post('servicios/insertarservicio',  (req, res) => {
   try {
      const insertarServicio = model.insertarServicio(req.body);

      res.status(200).send(insertarServicio);

   } catch (error) {
      res.status(500).send(error);
   }
})