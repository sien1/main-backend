const cmd = require('node-cmd');
const exp = module.exports;
const db  = require('../Databases/database');
const fs  = require('fs');
const path = require('path');
const maquinas = require('../../MAQUINAS/models');
const util = require('util');
const exec = util.promisify(require('child_process').exec);



exp.printMachineLabels = async (labels, empleado) => {

    if(labels > 20 && labels < 0)
        throw 'El numero de etiquetas no debe ser mayor a 20 ni menor que 1';

    //CHECK IF PRINTER IS CONNECTED
    const {stderr} =  await exec(`wmic path CIM_LogicalDevice where "Description like 'USB Printing Support' and Status='OK'" get availability`)

    if(stderr) {
        throw `Impresora desconectada: ${stderr} \n`
    };

    try {
        const query = `SELECT TOP ${labels} qr.Id
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
        WHERE qr.Activo = 0 AND qr.Asignado = 0 AND qr.IdUsuarioAlta = ${empleado.Id}`;

        let qrs = await db.query(query);

        qrs = qrs.recordset;

        if(qrs.length <= 0)
            return ('EL usuario no tiene qrs registrados');
        
    
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


        fs.writeFile('montesquieu.zpl', printout, async function(err){
            if(err) return console.log(err+'mkhdfhgfjkdfjkg36');

            const dir = path.dirname('C:\\Users\\olish\\APPS\\altas\\BACKEND\\lib\\TOOLS\\Printer\\zebra.bat');

            console.log(dir);

            console.log(__dirname + '\\zebra.bat');

            const base = path.basename('C:\\Users\\olish\\APPS\\altas\\BACKEND\\lib\\TOOLS\\Printer\\zebra.bat');

            console.log(base);

            const bat = __dirname + '\\zebra.bat';
           
            const {stderr} = await exec(`cmd /c ${bat}`);

            if(stderr)
                throw stderr

            for (let qr of qrs) {

                console.log(qr);

                const sql = `UPDATE Maquinas.dbo.QR SET Activo = 1 WHERE Id = ${qr.Id}`;
                await db.query(sql);

                await maquinas.createCodes(empleado.Id);
            }

        });
        
    } catch (error) {
        return error
    }
    
    
}
