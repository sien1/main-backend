const express = require('express');
const app = express();
let proveedores  = require('./lib/PROVEEDORES');
//let clientes   = require('./lib/CLIENTES');
const llaves     = require('./lib/LLAVES');
const cache      = require('./lib/CACHE');
const users      = require('./lib/USERS');
const empleados  = require('./lib/EMPLEADOS');
const reportes   = require('./lib/REPORTES');
const bodyParser = require('body-parser');
const cors       = require('cors');
const expJwt     = require('express-jwt');
const dotenv     = require('dotenv');
dotenv.config();
 
//Parsers   
// app.use(bodyParser.urlEncoded({
//     extended: true
// }));
app.use(bodyParser.json()); 
app.use(cors());

//Middleware Rutas
const jwtCheck = expJwt({
    secret: 'fuck these hoes'
});
 
app.use(expJwt({secret:process.env.SECRET, getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'auth') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null; 
}}).unless({path:['/users/login','/users/livesession']}));
    
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({
          message:err.inner.message,
          success:false,
          errnum:1
      });
    }
});

app.use(proveedores);
//app.use(clientes);
app.use(cache);
app.use(users);
app.use(empleados);
app.use(reportes);
app.use(llaves);
app.listen(process.env.PORT);
console.log(process.env.PORT);