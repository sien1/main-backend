const exp  = module.exports;
var   xlsx = require('node-xlsx');
const fs = require("fs");
const objetoEmpleados = require('./empleados.json');
const { debug } = require('console');
const db = require('../TOOLS/Databases/database');


const cargarExcel  = () => {
    return new Promise((resolve, reject) => {
        //var obj = xlsx.parse(__dirname + '/clientes.xlsx');
        var obj = xlsx.parse(fs.readFileSync(__dirname + '/Empleados2.xlsx'));

        fs.writeFile("empleados.json", JSON.stringify(obj), 'utf-8', function(err){
            if(err) {
                reject(err);
            }

            resolve('success');
        });
    });
}

const insertarEmpleadosExcelBD = () => {
    objetoEmpleados[0].data.shift();
    let Empleados = objetoEmpleados[0].data;
    
    return new Promise((resolve, reject)=>{

        
        Empleados.map(empleado=>{
            let params = [];
            //Quitar el id al empleado para que no itere sobre el
            empleado.shift();

            //parametros para llenar el objeto de la base de datos
            let parametros = [
                ["ApellidoPaterno", 'NVarChar'],
                ["ApellidoMaterno", 'NVarChar'],
                ["Nombre", 'NVarChar'], 
                ["NSS", 'NVarChar'],
                ["RFC", 'NVarChar'],
                ["CURP",'NVarChar'],
                ["FechaNacimiento", 'Date'],
                ["FechaEntrada", 'Date'],
                ["FechaAlta", 'DateTime'],
                ["FechaSalida", 'Date'],
                ["Activo", 'Bit'],
                ["IdDepartamento", 'Int'],
                ["IdSucursal", 'Int'],
                ["IdPuesto", 'Int'] 
            ];
            
            empleado.map((atributo, index) => {
                let objDB = {};
                objDB.name  = parametros[index][0];
                objDB.type  = parametros[index][1];
                objDB.value = atributo ? atributo : 0;
                params.push(objDB);
            });

            db.procedure('Empleados.dbo.INSERTAR_EMPLEADOS', params )
            .then(x=>{console.log(x)})
            .catch(err => {console.log(err)});

        });
        

    //     "Id","ApellidoPaterno","ApellidoMaterno","Nombre","NSS","RFC","CURP","FechaNacimiento","FechaEntrada","FechaAlta","FechaSalida","Activo","IdDepartamento","IdSucursal","IdPuesto","Id","Usuario","Password","PIN","Permisos","IdEmpleado"]
    });
}



exp.getAllEmpleados = () => {
    return new Promise((resolve, reject)=>{
        const db =  require('../TOOLS/Databases/database');

        db.query('SELECT * FROM Empleados.dbo.Empleados')
        .then(resultado => resolve(resultado))
        .catch(err => reject(err));

    });
}


exp.insertarEmpleadosExcel = () => {
    return new Promise((resolve, reject) =>{
        insertarEmpleadosExcelBD()
        .then(x => resolve(x))
        .catch(err => reject(err));
    });
}


