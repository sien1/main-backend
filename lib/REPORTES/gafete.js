const FPDF  = require('node-fpdf');

const db    = require('./../TOOLS/Databases/database');
const qr    = require('qrcode');
const exp   = module.exports;
const pngToJpeg = require('png-to-jpeg');
const fs    = require('fs');
const VCard = require('vcard-creator').default;



async function _createVcard(empleado) {

    try {

        const SIENVcard = new VCard();

        // SIENVcard
        // .addName(`${empleado.ApellidoPaterno} ${empleado.ApellidoMaterno}`, empleado.Nombre)
        // .addCompany('SIEN INGENIERIA')
        // .addJobtitle(empleado.Puesto)
        // .addEmail(empleado.Email? empleado.Email: 'servicios@sien.in')
        // .addPhoneNumber(empleado.Telefono? empleado.Telefono:'6563243501', 'MOVIL')
        // .addURL('http://www.sien.in');

        SIENVcard
        .addName(`GARCIA BAUTISTA NORBERTO PABLO`)
        .addCompany('SIEN INGENIERIA')
        .addJobtitle('AYUDANTE GENERAL')
        .addEmail('servicios@sien.in')
        .addPhoneNumber('6563243501', 'MOVIL')
        .addURL('http://www.sien.in');


        return await SIENVcard.toString();

    } catch (error) {
        return error;
    }

}


async function _getQrKey(nss){
    try {
        
        const query = `SELECT * FROM Empleados.dbo.EmpleadosQR WHERE NSS=${nss}`;

        const key =  await db.query(query);
        
        return key.recordset[0].QR

    } catch (error) {
        return error;
    }
    
}

async function _createQR(key, empleado){
    try {

        var opts = {
            errorCorrectionLevel: 'H',
            quality: 0.95,
            margin: 1,
            type:'jpg'
        };


        await qr.toFile(`${empleado.NSS}.png`,key,{}, async function (err) {
            if (err) throw err

            console.log(err);
 
            let buffer = await fs.readFileSync(`${empleado.NSS}.png`);

            await pngToJpeg({quality: 100})(buffer)
            .then(async output => await fs.writeFileSync(`./${empleado.NSS}.jpeg`, output));
        })

        // return await qr.toFile('qr.png', key, opts, function (err, url) {
        //     console.log(err, url);
        //     if (err) throw err
        // });

    } catch (err) {
        console.log(err);
        return err;
    }
}

async function card(empleado, vcard){
    try {

        

        const pdf   = new FPDF('P', 'mm', 'Letter');

        pdf.AddPage();
        pdf.Rect(5, 5, 53.98, 85.6);
        pdf.Rect(60, 5, 53.98, 85.6);

        pdf.SetFont('Arial','',12);

        pdf.SetDrawColor(240);
        
        pdf.Rect(5.5, 63.5, 53, 24, 'F');

        pdf.Image('with.jpg', 5.5, 9.5, -1265, -900);  

        pdf.Image('leer2.jpg', 60.5, 9.5, -1265, -900);

        //pdf.Image(`C:/Users/olish/Pictures/norberto pablo garcia bautista.jpg`, 67.5, 50.5, -200, -200);

        pdf.Image(`C:/Users/olish/Pictures/manuel flores arenas.jpg`, 10.5, 10.5, -200, -200);

        pdf.SetTextColor(255, 102, 0);
        pdf.SetFontSize(7.5);

        pdf.SetY(55.5);
        pdf.SetX(5);
        
        pdf.Cell(53,10,'AYUDANTE GENERAL',0,1,'C');

        pdf.SetY(64.5);
        pdf.SetX(5);

        pdf.Cell(53,10,`MANUEL FLORES ARENAS`,0,1,'C');

        pdf.Cell(43,10,`33007407407`,0,1,'C');


        pdf.Output();

    } catch (error) {

        console.log(error);
        return error;
    }
    
}

exp.getGafete = async (nss) => {
    
    try {
    
        // const empleado = await getEmpleado(nss);
        // const vircard = await _createVcard(empleado);
        // await _createQR(vircard, empleado);
        await card(empleado);

        return true;

    } catch (error) {
        return error
    }
    
}

async function getEmpleado(nss) {
    try {
        const query =  `SELECT Emp.*, CatP.Puesto, Mail.Email, Tel.Telefono FROM Empleados.dbo.Empleados Emp 
                        LEFT JOIN Empleados.dbo.CatPuestos CatP ON Emp.IdPuesto = CatP.Id
                        LEFT JOIN Empleados.dbo.Correos Mail ON Mail.IdEmpleado = Emp.Id
                        LEFT JOIN Empleados.dbo.Telefonos Tel On Tel.IdEmpleado = Emp.Id
                        WHERE NSS = ${nss}`;


        let empleado =await  db.query(query);
        empleado = empleado.recordset[0];

        return empleado;
    } catch (error) {
        return error;        
    }
}


card();