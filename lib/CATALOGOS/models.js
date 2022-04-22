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
    const query =  `SELECT CS.Id, CS.Descripcion, CS.Clave, TS.Descripcion as CatDescripcion
                    FROM Servicios.dbo.CatalogoServicios CS 
                    LEFT JOIN Servicios.dbo.CatalogoTiposServicio TS ON TS.Id = CS.IdTipoServicio
                    ORDER BY CS.Descripcion  ASC`;

    return new Promise((resolve, reject) => {
        db.query(query)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
}

exp.catalogoEmpleados = (str) => {
    const query = `SELECT Emps.Nombre, Emps.ApellidoPaterno, Emps.ApellidoMaterno, Emps.Id, Puesto  FROM Empleados.dbo.Empleados Emps
    LEFT JOIN Empleados.dbo.CatPuestos CatP ON Emps.IdPuesto = CatP.Id ORDER BY Emps.Nombre ASC`;

    return new Promise((resolve, reject) => {
        db.query(query)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
}

exp.catalogoTipoMaquinas = async (str) => {
    const query = `SELECT * FROM Maquinas.dbo.CatTipoMaquina ctm ORDER BY ctm.Descripcion ASC `;

    try {
        const res = await db.query(query);
        return res;
    } catch (error) {
        return error;
    }
}