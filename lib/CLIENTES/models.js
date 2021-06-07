const exp  = module.exports;
const db = require('../TOOLS/Databases/database');
const excelToJSON =  require('../TOOLS/AdapterExcelToJSON/ExcelToJSON');
const fs = require('fs');


exp.insertarClientesDocumento = () => {
    return new Promise((resolve, reject) => {
        try {
            excelToJSON.excelToJSON(__dirname+'/toc.xlsx')
            .then(clientes => {
                clientes.map(cliente=>{
                    insertarCliente(cliente)
                    .then(result => true)
                    .catch(error => fs.writeFile("clientError.txt", error+'\n'));
                });
                // insertarCliente(cliente)
                // .then(result => console.log(result))
                // .catch(error => console.log(error));//fs.writeFile("clientError.txt", error+'\n'))
            })
            .catch(err => reject(err));

            // clientesExcel.map((cliente) => {

            //     console.log(cliente);
            //     // insertarCliente(cliente)
            //     // .then(result => console.log(result))
            //     // .catch(error => fs.writeFile("clientError.txt", error+'\n'))
            // })
            
           // resolve('SE ARMO CON LOS CLIENTES');
        } catch (error) {
            reject(error);
        }
        
    })
}

const insertarCliente = (cliente) => {
    return new Promise((resolve, reject)=>{
        try{
            let params = [
                {
                    name:'RazonSocial',
                    value:cliente.RazonSocial,
                    type:'NVarChar'
                },
                {
                    name:'RFC',
                    value:cliente.RFC,
                    type:'NVarChar'
                },
                {
                    name:'NombreComercial',
                    value:cliente.NombreComercial,
                    type:'NVarChar'
                },
                {
                    name:'Clave',
                    value:cliente.Clave,
                    type:'NVarChar'
                }
            ];

            db.procedure('Clientes.dbo.INSERTAR_CLIENTE', params )
            .then(x => resolve(x))
            .catch(err => reject(err));
        }
        catch{
            reject(error)
        }
    });
}

exp.insertarClientes = () => {
    //const jsonClientes = require("../../output.json");
    // return new Promise((resolve, reject) => {
    //     let i = 4;
    //     let cliente = jsonClientes[0].data[i];
    //     while (cliente !== undefined && cliente.length !== 0) {
    //         let params = [
    //             {
    //                 name:'RazonSocial',
    //                 value:,
    //                 type:'NVarChar'
    //             },
    //             {
    //                 name:'RFC',
    //                 value:,
    //                 type:'NVarChar'
    //             },
    //             {
    //                 name:'Direccion',
    //                 value:,
    //                 type:'NVarChar'
    //             },
    //             {
    //                 name:'NombreComercial',
    //                 value:cliente[0],
    //                 type:'NVarChar'
    //             },
    //             {
    //                 name:'Pais',
    //                 value:,
    //                 type:'NVarChar'
    //             },
    //             {
    //                 name:'Estado',
    //                 value:,
    //                 type:'NVarChar'
    //             },
    //             {
    //                 name:'Ciudad',
    //                 value:,
    //                 type:'NVarChar'
    //             }
    //         ]

    //         let query = `
    //         INSERT INTO [dbo].[Clientes]
    //             ([RazonSocial]
    //             ,[RFC]
    //             ,[Direccion]
    //             ,[NombreComercial])
    //         VALUES
    //             (@RazonSocial
    //             ,@RFC
    //             ,@Direccion
    //             ,@NombreComercial`;


    //         db.query('SELECT * FROM Clientes.dbo.Clientes').then((response) => {
    //             console.log(response);
    //         });
    //         i++;
    //     }       
    // });
}

