const exp  = module.exports;
const db = require('../TOOLS/Databases/database');

exp.insertarServicios = (params) => {
    return new Promise((resolve, reject) => {
        //check that the project exists
        


        //crear un numero de servicio
        let Servicio = [];
        let Codigo = {}, IdUsuarioAlta = {}, Descripcion = {}, IdTiposServicio = {}, IdProyecto = {};

        try {
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

            db.procedure('Servicios.dbo.Servicios', Servicio )
            .then(resultado => resolve(resultado))
            .catch(error => reject(error));

        } catch (error) {
            reject(error);
        }

    });
}l