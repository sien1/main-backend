const exp  = module.exports;
var   xlsx = require('node-xlsx');
const fs = require("fs");
const db = require('../TOOLS/Databases/database');

exp.cargarClientesExcel = () => {
    return new Promise((resolve, reject) => {
        var obj = xlsx.parse(__dirname + '/clientes.xlsx');
        var obj = xlsx.parse(fs.readFileSync(__dirname + '/clientes.xlsx'));

        fs.writeFile("output.json", JSON.stringify(obj), 'utf-8', function(err){
            if(err) {
                reject(err);
            }

            resolve('success');
        });
    });
}

exp.insertarClientes = () => {
    const jsonClientes = require("../../output.json");
    return new Promise((resolve, reject) => {
        let i = 4;
        let cliente = jsonClientes[0].data[i];
        while (cliente !== undefined && cliente.length !== 0) {
            let params = [
                {
                    name:'RazonSocial',
                    value:,
                    type:'NVarChar'
                },
                {
                    name:'RFC',
                    value:,
                    type:'NVarChar'
                },
                {
                    name:'Direccion',
                    value:,
                    type:'NVarChar'
                },
                {
                    name:'NombreComercial',
                    value:cliente[0],
                    type:'NVarChar'
                },
                {
                    name:'Pais',
                    value:,
                    type:'NVarChar'
                },
                {
                    name:'Estado',
                    value:,
                    type:'NVarChar'
                },
                {
                    name:'Ciudad',
                    value:,
                    type:'NVarChar'
                }
            ]

            let query = `
            INSERT INTO [dbo].[Clientes]
                ([RazonSocial]
                ,[RFC]
                ,[Direccion]
                ,[NombreComercial])
            VALUES
                (@RazonSocial
                ,@RFC
                ,@Direccion
                ,@NombreComercial`;


            db.query('SELECT * FROM Clientes.dbo.Clientes').then((response) => {
                console.log(response);
            });
            i++;
        }       
    });
}

