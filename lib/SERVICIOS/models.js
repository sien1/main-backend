const exp  = module.exports;
const db = require('../TOOLS/Databases/database');

exp.insertarServicio = async(params) => {
    
        try{
            //check that the project exists
            const query = `SELECT * FROM Proyectos.dbo.Proyectos WHERE Id = ${params.IdProyecto}`;
            
            const proyecto = await db.query(query); 

            if( proyecto.length <= 0 ) {
                return ('NO EXISTE EL PROYECTO');
            }

            //crear un numero de servicio
            let Servicio = [];
            let Codigo = {}, IdUsuarioAlta = {}, Descripcion = {}, IdTiposServicio = {}, IdProyecto = {};

        
            Codigo.name  = 'Codigo';
            Codigo.type  = 'NChar';
            Codigo.value = params.Codigo;

            IdUsuarioAlta.name  = 'IdUsuarioAlta';
            IdUsuarioAlta.type  = 'Int';
            IdUsuarioAlta.value = params.IdusuarioAlta;

            Descripcion.name  = 'Descripcion';
            Descripcion.type  = 'NVarChar';
            Descripcion.value = params.Descripcion;

            IdTiposServicio.name  = 'IdTiposServicio';
            IdTiposServicio.type  = 'Int';
            IdTiposServicio.value = params.IdTiposServicio;

            IdProyecto.name   = 'IdProyecto';
            IdProyecto.type   = 'Int';
            IdProyecto.value  = params.IdProyecto;

            Servicio.push(Codigo, IdUsuarioAlta, Descripcion, IdTiposServicio)

            const resultado = await db.procedure('Servicios.dbp.Servicios', Servicios);

            return resultado;

        } catch (error) {
            return error;
        }


};


exp.getServiciosByProyecto = async (IdProyecto) => {
    try {
        const query = `SELECT TOP (1000) [Id]
            ,[IdUsuarioAlta]
            ,[Codigo]
            ,[Descripcion]
            ,[IdTiposServicio]
            ,[IdProyecto]
            ,[FechaAlta]
            ,[Activo]
        FROM [Servicios].[dbo].[Servicios]
        WHERE IdProyecto = ${IdProyecto}`;

        const servicios =  await db.query(query);

        return servicios.recordset ;

    } catch (error) {
        return error;
    }
}