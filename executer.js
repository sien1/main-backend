const ExcelAdapter = require('./lib/TOOLS/AdapterExcelToJSON/ExcelToJSON');
const db = require('./lib/TOOLS/Databases/database');


async function chivi() {

    try {
        const Servicios = await ExcelAdapter.excelToJSON(__dirname + '\\Mantenimiento.xlsx');

        console.log(Servicios[1]);
        
        Servicios[1].forEach(async element => {

            console.log(element)

            try {
                const params = [
                    {
                        name:'Descripcion',
                        type:'NVarChar',
                        value:element.Categoria
                    }
                ]

                try {
                    const insertar =  await db.procedure('Servicios.dbo.INSERTAR_TIPOSERVICIO', params);
                    console.log(insertar);
                } catch (error) {
                    console.log(error);
                }
            } catch (error) {
                console.log(error);
            }

            // try {
            //     const params = [
            //         {
            //             name:'Clave',
            //             type:'NVarChar',
            //             value:element.Id
            //         },
            //         {
            //             name:'Descripcion',
            //             type:'NVarChar',
            //             value:element.Descripcion
            //         },
            //         {
            //             name:'IdTipoServicio',
            //             type:'Int',
            //             value:element['Tipo servicio']
            //         },
            //         {
            //             name:'IdUsuarioAlta',
            //             type:'Int',
            //             value:1
            //         }
            //     ];
    
            //     const insertarServicio = await db.procedure('Servicios.dbo.INSERTAR_SERVICIOS', params);
    
            //     console.log(insertarServicio);
            // } catch (error) {
            //     console.log(error);
            // }
            
        });

    } catch (error) {
        console.log(error);
    }
     
}


chivi();

