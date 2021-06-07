const exp  = module.exports;
var   xlsx = require('node-xlsx');
const fs = require("fs");   
const db = require('../TOOLS/Databases/database');


exp.catalogoClientes = (str) => {
    

    return new Promise((resolve, reject) => {
        //Obtener el listado de clientes de forma de catalogo
        const query ="SELECT RazonSocial as field1, Clave AS field2, Id as Id FROM Clientes.dbo.Clientes";

        db.query(query)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
}


exp.catalogoProyectos = (str) => {
    //Obtener el listado de Proyectos en forma de catalogo
    const query = "SELECT Clave as field1, Concepto as field2, Id FROM Proyectos.dbo.Proyectos";

    return new Promise((resolve, reject) => {
        db.query(query)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
}


exp.catalogoServicios = (str) => {
    //Obtener el catalogo de servicios
    const query =  `SELECT Clave as field1, Descripcion as field2, TS.Descripcion as Header 
                    FROM Servicios.dbo.CatalogosServicios CS 
                    LEFT JOIN Servicios.dbo.CatalogosTiposServicio TS ON TS.Id = CS.IdTipoServicio`;

    return new Promise((resolve, reject) => {
        db.query(query)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
}

exp.catalogoEmpleados = (str) => {
    const query = `SELECT Id as field1, Nombre +' '+ ApellidoPaterno +' '+ ApellidoMaterno as field2 FROM Empleados.dbo.Empleados WHERE Nombre like '%${str}%' OR ApellidoPaterno like '%${str}%' OR ApellidoMaterno like '%${str}%'`;

    return new Promise((resolve, reject) => {
        db.query(query)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
}