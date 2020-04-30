var express = require('express');
var app     = module.exports = express.Router();
var model   = require('./models');

//GET
app.get('/', (req, res) => {
   res.json({  
      w:'el;ds'
   })
})

//session   
app.get('/users/session', (req, res) => {
    
});

//user data
app.get('/users/data', (req, res) => {
   model.getData(req.query.token)      
   .then(response => res.status(response).json(response))
   .catch( error => res.status(error.code).json(error));
});

app.get('/users/livesession', (req, res) => {   
   if(req.query.token === 'undefined'  || !req.query.token) {
     return res.status(401).json({error:"Token erroneo"});
   }

   model.checkSession(req.query.token)
   .then( response => res.status(response.code).json(response))
   .catch( error   => res.status(error.code).json(error));
});

//POST
app.post('/users/login', (req, res) => {
   model.login(req.body.user, req.body.password)
   .then(response => {
      res.json({
         response: response,
         success: true
      });
   })
   .catch(error => {
      res.status(401).json({
         error: error,
         success: false
      }).end();
   })  
});

