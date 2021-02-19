const exp  = module.exports;
var   xlsx = require('node-xlsx');
const fs = require("fs");
const objetoEmpleados = require('./empleados.json');
const { debug } = require('console');
const db = require('../TOOLS/Databases/database');
const { resolve } = require('path');


const getProyectos = () => {
    return new Promise((res, rej)=>{
        //Obtener el listado de proyectos actual
        var query = "SELECT * FROM Proyectos.dbo.Proyectos";

        db.query(query)
        .then(reultado=> resolve(resultado))
        .catch(err=>reject(err));
    });
}
