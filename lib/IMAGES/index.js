var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');

//GET
app.get('/images/altamaquina/:idMaquina', async function(req, res) {

   try {

      const baseDir = 'SIENCONTROL/IMAGENES/MAQUINAS/ALTAS/';
      const dir = baseDir + req.params.idMaquina;

   
   const urls = await model.getImagesURL(dir);

   console.log(urls);

   const images = [];

   for (const file of urls) {
      let url = '';
      url= `${dir}/${file}`;
      images.push(url);
   }

   return res.status(200).send(images);

   } catch (error) {
      console.log(error);

      return res.status(500).send([]);

   }
   
});