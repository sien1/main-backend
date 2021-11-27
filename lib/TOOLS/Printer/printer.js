const cmd = require('node-cmd');
const exp = module.exports;
const db  = require('../Databases/database');
const fs  = require('fs');
const path = require('path');
const maquinas = require('../../MAQUINAS/models');


exp.printMachineLabels = async (nolabels, usuario) => {

    

    const query = `SELECT TOP ${nolabels} qr.Id
    ,[Codigo]
    ,qr.Activo
    ,qr.FechaAlta
    ,[IdUsuarioAlta]
    ,[Asignado]
    ,Emps.ApellidoMaterno
    ,Emps.ApellidoPaterno
    ,Emps.Nombre
    FROM [Maquinas].[dbo].[QR] qr
    LEFT JOIN Empleados.dbo.Empleados Emps ON Emps.Id =  qr.IdUsuarioAlta
    WHERE qr.Activo = 0 AND qr.IdUsuarioAlta = ${usuario.Id}`;


   
    
    let qrs = await db.query(query);


    qrs = qrs.recordset;

    if(qrs.length <= 0)
        return console.log('EL usuario no tiene qrs registrados');

    
    let printout = '';
    for (const qr of qrs) {
        printout += `^XA

        ^FX 
        ^CF0,45
        ^FO30,55^FDSIEN INGENIERIA^FS
        ^CF0,30
        
        l
        
        ^FX 
        ^CFA,15
        ^CFA,30
        ^FO30,110^FD${qr.Nombre} ${qr.ApellidoPaterno}^FS
        ^CF0,100
        
        ^FO30,160^FD${qr.Id}^FS
        
        ^CF0,25
        
        ^FO30,345^FDTel. 656-324-3501^FS
        
        ^FO465,60
        ^BQN,2,6,Q,7
        ^FDQA,https://api.whatsapp.com/send?phone=5216567522752&text=${qr.Codigo}^FS
        ^FO15,30^GB785,370,1^FS
        ^FO15,30^GB410,370,1^FS
        
        ^XZ`
    }


    fs.writeFile('montesquieu.zpl', printout, function(err){
        if(err) return console.log(err);
        console.log('se ha generado el archivo para imprimir');

        const dir = path.dirname('C:\\Users\\olish\\APPS\\altas\\BACKEND\\lib\\TOOLS\\Printer\\zebra.bat');

        const base = path.basename('C:\\Users\\olish\\APPS\\altas\\BACKEND\\lib\\TOOLS\\Printer\\zebra.bat');

        const bat = dir+'\\'+base;

        require('child_process').exec(`cmd /c ${bat}`, function(error){
            if(error) return error;

            try {

                qrs.map(async qr => {
                    try {
                        await db.query(`UPDATE Maquinas.dbo.QR SET Activo = 1 WHERE Id = ${qr.Id}`);

                        await maquinas.createCodes(usuario);
                    } catch (error) {
                        console.log(error);
                    }
                } )

                return 'Se han impreso los qrs';
            } catch (error) {
                return error;
            }

            
        });

    });
}
