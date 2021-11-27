const db =  require('../TOOLS/Databases/database');
const enc = require('../TOOLS/Encriptador/encrypter');
const QRCode = require('qrcode');

async function insertarQRS(){

    try {
        const query =  `SELECT Emps.NSS  FROM Empleados.dbo.Empleados Emps
                    LEFT JOIN Empleados.dbo.EmpleadosQR Eqr ON Emps.NSS = Eqr.NSS
                    WHERE Eqr.NSS IS NULL`;

        let empsSinQr = await db.query(query);
        empsSinQr = empsSinQr.recordset;

        console.log(empsSinQr);

        empsSinQr.map(async emp => {
            const random = await enc.getRandomString(16);
            const qr = `SIENEMP${random}`;

            try {
                const ins = await _insQR(emp.NSS, qr);
                console.log(ins);
            } catch (error) {
                console.log(error);
            }


            
        });

    } catch (error) {
        console.log(error);
    }
}


async function _generateQR(text){
    
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        return err;
    }
      
}




async function _insQR(nss, qr){
    try {
        const query = `INSERT INTO [Empleados].[dbo].[EmpleadosQR]
                            ([NSS]
                            ,[QR])
                        VALUES
                            (${nss}
                            ,${qr})`;

        console.log(query);
        
        
        //await db.query(query);

        return true;

    } catch (error) {
        return error;
    }
}

console.log(',lsdfkljdf');

insertarQRS();