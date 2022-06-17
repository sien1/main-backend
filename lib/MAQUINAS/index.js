var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');
var print   = require('../TOOLS/Printer/printer');
const { Console } = require('winston/lib/winston/transports');

app.get('/maquinas/generarcodigos', async (req, res) => {

   try {
      const userid = req.query.id;
      console.log(userid);
      await model.createCodes(userid);
      res.status(200).send(`Se han creado codigos para el usuario ${req.user}`);
      
   } catch (error) {
      res.status(500).send(error);
   }
});

app.get('/maquinas/codigos', async(req, res) => {
   try {
      const listaqrs = await model.getCodigos(req.user);
      res.status(200).send(listaqrs);
   } catch (error) {
      res.status(501).send(error);
   } 
});

app.get('/maquinas/maquinas', async (req, res) => {
   try {
      const maquinas  = await model.getMaquinas();
      res.status(200).send(maquinas.recordset);
   } catch (error) {
      res.status(501).send(error);
   }
});

app.get('/maquinas/unassignedqrs', async (req, res) => {
   try {
      console.log(req.user);


      const unassignedqrs  = await model.getQRUnassigned(req.user.IdEmpleado);
      res.status(200).send(unassignedqrs.recordset);
   } catch (error) {
      res.status(501).send(error);
   }
});


app.get('/maquinas/singleqr', async (req, res) => {
   try {
      const qr = await model.getSingleCode(req.query.id);
      res.status(200).send(qr);

   } catch (error) {
      res.status(500).send(error);
      
   }
})


app.get('/maquinas/maquina', async (req, res) => {
   try {
      const maquinaInfo = await model.getMaquinaInfo(req.query.id);
      res.status(200).send(maquinaInfo);
   } catch (error) {
      res.status(500).send(error);
   }
});

/**POST**/

app.post('/maquinas/printlabels', async (req, res) => {
   try {
      await print.printMachineLabels(req.body.labels, req.body.empleado);
      
      await model.getQRUnassigned(req.body.empleado.Id);

      return res.status(200).send(true);
      
   } catch (error) {
      return  res.status(500).send(error);
   }
});

app.post('/maquinas/saveinfo', async (req, res) => {
   try {
      await model.saveMaquinaInfo({data:req.body.data, user:req.user})
      return;
   } catch (error) {
      return res.status(500).send(error);
   }
})