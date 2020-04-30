const exp = module.exports;
const db  = require("../TOOLS/Databases/database");



exp.getDepartamentos = (IdSucursal) => {
    return new Promise((resolve, reject) =>{
        db.query(`SELECT deptos.* FROM SIEN.dbo.Departamentos deptos
            LEFT JOIN SIEN.dbo.Sucursales sucs ON sucs.Id = deptos.IdSucursal
            WHERE sucs.Id = ${IdSucursal}`)
        .then(data => {
            resolve(data);
        })
        .catch(error => {console.log(error);reject(error)});
    });
}

exp.getSucursales = (IdSucursal) => {
    return new Promise((resolve, reject) =>{
        db.query(`SELECT deptos.* FROM SIEN.dbo.Departamentos deptos
            LEFT JOIN SIEN.dbo.Sucursales sucs ON sucs.Id = deptos.IdSucursal
            WHERE sucs.Id = ${IdSucursal}`)
        .then(data => {
            resolve(data);
        })
        .catch(error => {console.log(error);reject(error)});
    });
}

exp.getEmpleados = (IdSucursal) => {
    return new Promise((resolve, reject) =>{
        db.query(`SELECT deptos.* FROM SIEN.dbo.Departamentos deptos
            LEFT JOIN SIEN.dbo.Sucursales sucs ON sucs.Id = deptos.IdSucursal
            WHERE sucs.Id = ${IdSucursal}`)
        .then(data => {
            resolve(data);
        })
        .catch(error => {console.log(error);reject(error)});
    });
}