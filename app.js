const express = require('express');
const app = express();
const proveedores  = require('./lib/PROVEEDORES');
const clientes   = require('./lib/CLIENTES');
const llaves     = require('./lib/LLAVES');
const cache      = require('./lib/CACHE');
const users      = require('./lib/USERS');
const empleados  = require('./lib/EMPLEADOS');
//const reportes   = require('./lib/REPORTES');
const proyectos  = require('./lib/PROYECTOS');
const claves     = require('./lib/CLAVES');
const catalogos  = require('./lib/CATALOGOS');
const maquinas   = require('./lib/MAQUINAS');
const images     = require('./lib/IMAGES');
const servicios  = require('./lib/SERVICIOS');
const bodyParser = require('body-parser');
const cors       = require('cors');
const expJwt     = require('express-jwt');  
const path       = require('path'); 
const dotenv     = require('dotenv');


dotenv.config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`)});




 
//Parsers   
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); 
app.use(cors());

//Middleware Rutas
const jwtCheck = expJwt({
    secret: 'fuck these hoes'
});

app.use(expJwt({secret:process.env.SECRET, getToken: function fromHeaderOrQuerystring (req) {

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'auth') {
        return req.headers.authorization.split(' ')[1];
    } else if ((req.query && req.query.token) || req.body.token ) {

        if(req.query.token) {
            return req.query.token;
        }
        else {
            return req.body.token;
        }
    }
    return null; 
}}).unless({path:['/users/login','/users/livesession','/maquinas/printlabels']}));
    
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({
          message:err.inner.message,
          success:false,
          errnum:1
      });
    }
});


var dir = path.join('Y:/DATOS');

app.use(express.static(dir));


app.use(proveedores);   
app.use(clientes);
app.use(cache);
app.use(users);
app.use(empleados);
//app.use(reportes);
app.use(llaves);
app.use(proyectos);
app.use(claves);
app.use(catalogos);
app.use(maquinas);
app.use(images);
app.use(servicios);
app.listen(process.env.PORT, '0.0.0.0');
console.log('Aplicacion corriendo en el puerto ' + process.env.PORT);