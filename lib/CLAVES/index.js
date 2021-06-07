const express = require('express');
const app = module.exports = express.Router();
const models  = require('./models');

app.get('/claves/proyecto/suffix', (req, res)=>{
    models.claveProyectosAno()
    .then(response => res.status(200).send({data:response}))
    .catch(error => res.status(500).send(error));
});

app.post('/claves/proyecto/clave', (req, res) => {

});