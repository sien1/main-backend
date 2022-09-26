const exp  = module.exports;
const { Console } = require('winston/lib/winston/transports');
const db = require('../TOOLS/Databases/database');

//LISTA DE PROYECTOS
//Se tienen que cargar los proyectos de diez en diez

exp.getProyectos = (params) => {
    
    return new Promise((resolve, reject)=>{
        if(params) {
            // const storeProcedure = 'Proyectos.dbo.getProyectos';
            // let pageMax = {};
            // let pageMin = {};
        
            // pageMin.name  = 'pageMin';
            // pageMin.type  = 'Int';
            // pageMin.value = params.pageMin;
            
            // pageMax.name  = 'pageMax';
            // pageMax.type  = 'Int';
            // pageMax.value = params.pageMax;

            // db.procedure(storeProcedure, [pageMin, pageMax])
            // .then(resultado => resolve(resultado))
            // .catch(err => reject(err));l

            const query  = `
                SELECT 
                Proy.Id,
                Proy.Clave,
                Proy.concepto as Concepto,
                (SELECT RazonSocial FROM Clientes.dbo.Clientes WHERE Id = Proy.IdSubsidiario) as Subsidiario,
                Cli.RazonSocial as Cliente,
                Emps.Nombre +' '+ Emps.ApellidoPaterno as 'Usuario Alta',
                CONVERT(varchar, Proy.AltaProyecto, 3) as 'Fecha Alta'
                FROM Proyectos.dbo.Proyectos Proy
                LEFT JOIN Empleados.dbo.Usuarios Usu ON Proy.IdUsuarioAlta = Usu.Id
                LEFT JOIN Empleados.dbo.Empleados Emps ON Emps.Id = Usu.IdEmpleado
                LEFT JOIN Clientes.dbo.Clientes Cli ON Proy.IdCliente = Cli.Id
                ORDER BY Proy.Id DESC`;

            db.query(query)
            .then(resultado => resolve(resultado))
            .catch(err => reject(err));
            
        }
        else {
            reject('Missing Params');
        }
    });
}

//AGREGAR NUEVO PROYECTO
exp.insertarProyecto =(params) => {

    return new Promise(async (resolve, reject) => {

        //Verificar si el proyecto ya existe
        let Proyecto  = [];
        let Clave = {};
        let IdCliente = {};
        let IdUsuarioAlta = {};
        let IdSubsidiario = {};
        let Concepto = {};

        //Crear clave  de proyeco automaticamente


        try {

            const clave = await generarClaveProyecto(1);


            Clave.name  = 'Clave';
            Clave.type  = 'NVarChar';
            Clave.value = clave;

            IdUsuarioAlta.name  = 'IdUsuarioAlta';
            IdUsuarioAlta.type  = 'Int';
            IdUsuarioAlta.value = params.user.IdEmpleado;

            IdCliente.name  = 'IdCliente';
            IdCliente.type  = 'Int';
            IdCliente.value = params.body.data.clienteDir.Id;

            IdSubsidiario.name  = 'IdSubsidiario';
            IdSubsidiario.type  = 'Int';
            IdSubsidiario.value = params.body.data.clienteEjec.Id;

            Concepto.name  = 'Concepto';
            Concepto.type  = 'NVarChar';
            Concepto.value = params.body.data.proyectoDescripcion;

            Proyecto.push(Clave, IdCliente, IdUsuarioAlta, IdSubsidiario, Concepto);

            const resultado = await  db.procedure('Proyectos.dbo.INSERTAR_PROYECTOS', Proyecto);
            resolve(resultado.recordset[0]);
            
        } catch (error) {
            reject(error);
        }

    });
}

//CAMBIAR ESTATUS DE PROYECTO

//ACTUALIZAR DATOS DE PROYECTO

//FUNCTIONS
async function generarClaveProyecto(IdCliente){
    const query = `SELECT Cli.Clave +'-' +(SELECT CAST(IDENT_CURRENT('Proyectos.dbo.Proyectos') AS nvarchar)) As Clave FROM 
                   Clientes.dbo.Clientes Cli WHERE Cli.Id = ${IdCliente}`;

    try {
        const clave = await db.query(query);
        return clave.recordset[0].Clave;

    } catch (error) {
        return error;

    }
}