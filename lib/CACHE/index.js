var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');
var jwt     = require("jsonwebtoken");
const dotenv= require('dotenv');
dotenv.config();

//GET
app.get('/cache/departamentos', (req, res) => {
    if(!req.query.token){
        return res.status(401).json({error:" Falta token"});
    }

    jwt.verify(req.query.token, process.env.SECRET, function(err, body) {
        if(err){
            return res.status(401).json({error:err});
        }
        else {
            model.getDepartamentos(body.IdEmpleado)
            .then(result => res.status(200).json(result.recordset))
            .catch(err =>  res.status(500).json({error:err.message, success:false}).end()); 
        }
    });
}); 

app.get('/cache/departamentos', (req, res) => {
    if(!req.query.token){
        return res.status(401).json({error:" Falta token"});
    }

    jwt.verify(req.query.token, process.env.SECRET, function(err, body) {
        if(err){
            return res.status(401).json({error:err});
        }
        else {
            model.getSucursales(body.IdEmpleado)
            .then(result => res.status(200).json(result.recordset))
            .catch(err =>  res.status(500).json({error:err.message, success:false}).end()); 
        }
    });
}); 