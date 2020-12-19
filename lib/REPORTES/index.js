var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');



app.get('/reportes/gafete', (req, res)=>{
    model.reporteGafete()
    .then(resultado => res.status(200).send({resultado}))
    .catch(err=>res.status(404).send({err}));
});