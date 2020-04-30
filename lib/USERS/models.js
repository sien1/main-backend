const exp       = module.exports;
const jwt       = require('jsonwebtoken');
const db        = require('../TOOLS/Databases/database');

exp.cargarClientesExcel = () => {
    return new Promise((resolve, reject) => {
        
    });

    return new Promise((resolve, reject) => {
        var obj = xlsx.parse(__dirname + '/clientes.xlsx');
        var obj = xlsx.parse(fs.readFileSync(__dirname  + '/clientes.xlsx'));

        fs.writeFile("output.json", JSON.stringify(obj), 'utf-8', function(err){

        });     
    });
}

exp.getData  = (token) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * from Empelados.dbo.Usuarios").then(data  => {
            resolve(data);
        });
    }); 
}

exp.checkSession = (token) => {
    return new Promise((resolve, reject) => {
        if(!token){
            reject({
                message:'No token was found',
                success:false,
                code:401
            });
        }

        jwt.verify(token, process.env.SECRET, function(err) {
            if(err){
                reject({
                    data:err.message,
                    success:false,
                    code: 401
                });
            }
            else{
                resolve({
                    code:200,
                    success:true
                });
            }
        });
    })
}

const verifyToken = () => {
    
}

exp.login  = (user, password) => {
    return new Promise((resolve, reject) => {
        var params = [
            {
                name:'username',
                value:user,
                type:'NVarChar'
            },
            {
                name:'password',
                value:password,
                type:'NVarChar'
            }
        ];

        db.query(`SELECT 
                  Usu.Permisos, 
                  Usu.IdEmpleado, 
                  Emp.Nombre, 
                  Emp.ApellidoPaterno, 
                  Emp.ApellidoMaterno, 
                  Emp.IdDepartamento, 
                  Emp.IdSucursal,
                  Emp.IdPuesto
                   FROM Empleados.dbo.Usuarios Usu 
                  LEFT JOIN Empleados.dbo.Empleados Emp ON Emp.Id = Usu.IdEmpleado
                  WHERE Usu.Usuario = @username AND Usu.Password = @password`, params)
        .then(response => {
            if(response.recordset.length == 0) {
                reject('Usuario o password erroneo');
            }

            createToken(response.recordset[0], token => {
                resolve(token);
            });
        })
        .catch(err => {
            reject("El servidor de Base de Datos no responde");
        });
    })
}

var createToken = function(jwtData, callback) {
    return callback(jwt.sign(jwtData, process.env.SECRET));
}