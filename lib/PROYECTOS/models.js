const exp  = module.exports;
const { Console } = require('winston/lib/winston/transports');
const db = require('../TOOLS/Databases/database');

//LISTA DE PROYECTOS
//Se tienen que cargar los proyectos de diez en diez

exp.getProyectos = (params) => {
    
    return new Promise((resolve, reject)=>{
        if(params) {
            const storeProcedure = 'Proyectos.dbo.getProyectos';
            let pageMax = {};
            let pageMin = {};
        
            pageMin.name  = 'pageMin';
            pageMin.type  = 'Int';
            pageMin.value = params.pageMin;
            
            pageMax.name  = 'pageMax';
            pageMax.type  = 'Int';
            pageMax.value = params.pageMax;

            db.procedure(storeProcedure, [pageMin, pageMax])
            .then(resultado => resolve(resultado))
            .catch(err => reject(err));
        }
        else {
            reject('Missing Params');
        }
    });
}

//AGREGAR NUEVO PROYECTO
exp.insertarProyecto = (params) => {


    
    return new Promise((resolve, reject) => {

        //Verificar si el proyecto ya existe
        let Proyecto  = [];
        let Clave = {};
        let IdCliente = {};
        let IdSubsidiario = {};
        let Concepto = {};

        //Crear clave  de proyeco automaticamente 



        try {
            Clave.name  = 'Clave';
            Clave.type  = 'NVarChar';
            Clave.value = params.Clave;

            IdUsuarioAlta.name  = 'IdUsuarioAlta';
            IdUsuarioAlta.type  = 'Int';
            IdUsuarioAlta.value = params.IdUsuarioAlta;

            IdCliente.name  = 'IdCliente';
            IdCliente.type  = 'Int';
            IdCliente.value = params.IdCliente;

            IdSubsidiario.name  = 'IdSubsidiario';
            IdSubsidiario.type  = 'Int';
            IdSubsidiario.value = params.IdSubsidiario;

            Concepto.name  = 'Concepto';
            Concepto.type  = 'NVarChar';
            Concepto.value = params.Concepto;

            Proyecto.push(Clave, IdCliente, IdUsuarioAlta, IdSubsidiario, Concepto);

            db.procedure('Proyectos.dbo.INSERTAR_PROYECTOS', Proyecto)
            .then(resultado => resolve(resultado))
            .catch(error => reject(error));
            
        } catch (error) {
            reject(error);
        }


    });
}



//CAMBIAR ESTATUS DE PROYECTO

//ACTUALIZAR DATOS DE PROYECTO

