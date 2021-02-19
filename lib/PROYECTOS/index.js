var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');


app.get('/proyectos/list', ()=>{
    model.getProyectos()
   .then((resultado) => {
      return res.status(200).send({resultado})
   })
   .catch(err => res.status(500).send({err}));
})