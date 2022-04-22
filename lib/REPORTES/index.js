var express = require('express');
var app     = module.exports = express.Router();
var gafete  = require('./gafete'); 

app.get('/reportes/gafete',async (req, res)=>{
    try {
        const result = gafete.getGafete(req.query.nss);    
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
    
});
