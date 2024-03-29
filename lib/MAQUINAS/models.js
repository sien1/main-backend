const exp = module.exports;
const db  = require('../TOOLS/Databases/database');
const QRCode = require('qrcode');
const encrypter = require("../TOOLS/Encriptador/encrypter");
const { getEmpleadoInfo } = require('../EMPLEADOS/models');
const { Console } = require('winston/lib/winston/transports');

exp.createCodes = async (idusuario) => {
    
    try {
        const query = `SELECT COUNT(*) AS codesLeft FROM Maquinas.dbo.QR WHERE Activo = 0 AND Id =${idusuario}`;
        let codesLeft = await db.query(query);

        const usuario  = await getEmpleadoInfo(idusuario);


        codesLeft  = codesLeft.recordset[0].codesLeft;

        let data = {};
        console.log(usuario)
        data.usuario = {nombre:usuario[0].Nombre, id:usuario[0].Id};
        data.timestamp = Date.now();

        console.log(data);
        

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
    const query  = `SELECT Maq.NumeroSerie,Maq.Clave, 
                    Maq.Modelo, 
                    Maq.Marca, 
                    Maq.FechaAlta, 
                    Maq.Activo, 
                    qr.Codigo, 
                    Emps.Nombre, 
                    Emps.ApellidoPaterno, 
                    Maq.Id,  
                    qr.Id AS NumQR, 
                    qr.FechaAlta As QRFechaAlta FROM  Maquinas.dbo.Maquinas Maq
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
    
    const maquinaInfo = await db.query(query);

    return maquinaInfo;
}

exp.saveMaquinaInfo = async(info) => {
    try {
        if(!info.data.id)
            return;

        const updateString = _makeUpdateString(info.data);

        const updateMaquina = `UPDATE Maquinas.dbo.Maquinas
                               SET ${updateString}, [IDUSUARIOALTA] = ${info.user.IdEmpleado}
                               WHERE Id=${info.data.id}`;
        
        if(updateString !== '')
            await db.query(updateMaquina);

        //VERIFICAR SI YA EXISTE LA RELACION MAQUINA CLIENTE
        const verifyMaquinaCliente = await db.query(`SELECT * FROM Maquinas.dbo.RelMaquinaCliente WHERE IdMaquina = ${info.data.id}`);

        if(verifyMaquinaCliente.recordset.length <= 0 && info.data.idCliente){
            const INSERTAR_RELACION =  `INSERT INTO Maquinas.dbo.RelMaquinaCliente
                                            ([IdMaquina]
                                            ,[IdCliente]
                                            ,[Fecha]
                                            ,[Activo])
                                    VALUES
                                            (${info.data.id}
                                            ,${info.data.idCliente}
                                            ,GETDATE()
                                            ,1)`;

            await db.query(INSERTAR_RELACION);
        }
        
        const RESULTADO =   `SELECT * FROM Maquinas.dbo.Maquinas Maqs
                            LEFT JOIN Maquinas.dbo.RelMaquinaCliente RMC ON RMC.IdMaquina = Maqs.Id 
                            WHERE Maqs.Id = ${info.data.idCliente}` ;

        const res = await db.query(RESULTADO);
        
        return res.recordset[0];

    } catch (error) {

        return error;      
    }

}


function _makeUpdateString(obj){
    let str ='';

    const update = {
        noserie:`[NUMEROSERIE]=`,
        clave:`[CLAVE]=`,
        modelo:`[MODELO]=`,
        marca:`[MARCA]=`,
        voltaje:`[VOLTAJE]=`,
        descripcion:`[DESCRIPCION]=`
    };
 
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const element = obj[key];
            if(element !== '' && update[key]){
                if(str === ''){
                    str += `${update[key]} '${element}'`
                }
                else {
                    str += `,${update[key]} '${element}'`
                }
            }
        }
    }

    return str;

}

function _makeInsertString(obj){
    let str ='';

    const insert = {
        id:`[IdMaquina] = `,
        cliente:`[IdCliente] = `,
    };
 
    for (const key in obj) {

        if (Object.hasOwnProperty.call(obj, key)) {
            console.log(key);
            const element = obj[key];
            if(element != ''){
                if(str === ''){
                    str += `${insert[key]} ${element}`
                }
                else {
                    str += `,${insert[key]} ${element}`
                }
            }
        }
    }
    
    return str;
}




