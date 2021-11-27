const exp = module.exports;
const db  = require('../TOOLS/Databases/database');
const QRCode = require('qrcode');
const encrypter = require("../TOOLS/Encriptador/encrypter");
const { getEmpleadoInfo } = require('../EMPLEADOS/models');

exp.createCodes = async (idusuario) => {
    
    try {
        let codesLeft = await db.query(`SELECT COUNT(*) AS codesLeft FROM Maquinas.dbo.QR WHERE Activo = 0 AND Id =${idusuario}`);

        const usuario  = await getEmpleadoInfo(idusuario);
        


        codesLeft  = codesLeft.recordset[0].codesLeft;

        let data = {};
        data.usuario = {nombre:usuario.nombre, id:usuario.IdEmpleado};
        data.timestamp = Date.now();

        

        while (codesLeft <= 20) {

            let codigoString = await _generarCodigo(data);
            codigoString = codigoString.toString();

           // let str = `https://api.whatsapp.com/send?phone=5216567522752&text=${codigoString}`

            let codigo ={
                name:'Codigo',
                value: codigoString,
                type:'NVarChar'
            };

            let user = {
                name:'IdUsuarioAlta',
                value:idusuario,
                type:'Int'
            }

            await db.procedure('Maquinas.dbo.INSERTAR_QR', [codigo, user]);
            
           



            codesLeft+=1;
            
        }
        
        

    } catch (error) {


        console.log(error);
        return error;
    }
   
}

async function _generarCodigo(str){
    try {
        return await encrypter.getRandomString(18);
    } catch (error) {
        return error;
    }

}

exp.getCodigos = async (usuario) => {
    try {
        const query = `SELECT * FROM Maquinas.dbo.QR WHERE Asignado = 0 AND IdUsuarioAlta = ${usuario.IdEmpleado} `;
        const listaCodigos = await db.query(query);

        let listaQRS = [];

        for (const element of listaCodigos.recordset) {
            let str = `https://api.whatsapp.com/send?phone=5216567522752&text=${element.Codigo}`;
            let qrcode = await _generateQR(str);
            listaQRS.push(qrcode);
        }

        return listaQRS;


    } catch (error) {
        
        return error
    }
}

exp.getSingleCode = async (Id) => {

    try {
        const query = `SELECT Codigo FROM Maquinas.dbo.QR WHERE Id = ${Id}`;
    
        const codigo = await db.query(query);

        let str = `https://api.whatsapp.com/send?phone=5216567522752&text=${codigo.recordset[0].Codigo}`;
        
        const qr = await _generateQR(str);
        return qr;
    } catch (error) {
        return error;
    }

}


async function _generateQR(text){
    try {
      return await QRCode.toDataURL(text)
    } catch (err) {
      return err;
    }
}


exp.getMaquinas = async () => {
    const query  = `SELECT Maq.NumeroSerie,Maq.Clave, Maq.Modelo, Maq.Marca, Maq.FechaAlta, Maq.Activo, qr.Codigo, Emps.Nombre,Maq.Id,  qr.Id AS NumQR, qr.FechaAlta As QRFechaAlta FROM  Maquinas.dbo.Maquinas Maq
                    LEFT JOIN Maquinas.dbo.RelMaquinaQR RMaqQR ON Maq.Id = RMaqQR.IdMaquinas
                    LEFT JOIN Maquinas.dbo.QR qr ON qr.Id = RMaqQR.IdQR
                    LEFT JOIN Empleados.dbo.Empleados Emps ON Emps.Id = Maq.IdUsuarioAlta ORDER BY Maq.FechaAlta DESC`;

    const maquinas = await db.query(query);

    return maquinas;

}


exp.getQRUnassigned = async (idEmpleado) => {
    const query = `SELECT qr.*, Emp.Nombre From Maquinas.dbo.QR qr
                   JOIN Empleados.dbo.Empleados Emp ON Emp.Id = qr.IdUsuarioAlta
                   WHERE qr.Activo = 0 AND qr.Asignado = 0 AND qr.IdUsuarioAlta  = ${idEmpleado}`;

    const unassignedQRS = await db.query(query);

    return unassignedQRS;
}

exp.getMaquinaInfo = async (id) => {
    const query = `DECLARE @point NVARCHAR(50);
                   DECLARE @geom geometry;
                   SELECT @point = Ubicacion.ToString() FROM Maquinas.dbo.Ubicaciones Ubicaciones WHERE Ubicaciones.Id = ${id}
                   SET @geom = geometry::Parse(@point)
                    
                   SELECT Maq.Id, Maq.NumeroSerie, Maq.Clave, Maq.Marca, Maq.Modelo, @geom.STY as Longitud, @geom.STX AS Latitud FROM Maquinas.dbo.Maquinas Maq
                   LEFT JOIN Maquinas.dbo.Ubicaciones Ubi ON Ubi.IdMaquina = Maq.Id WHERE Maq.Id = ${id}`;
    
    const maquinaInfo = await  db.query(query);

    return maquinaInfo;
}


