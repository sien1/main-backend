const exp  = module.exports;
const fs = require("fs");
const db = require('../TOOLS/Databases/database');
const pdf = require('pdf-creator-node');
const path = require("path");
const QRCode = require('qrcode');
const { encode } = require("querystring");
const encrypter = require("../TOOLS/Encriptador/encrypter");

//READ HTML TEMPLATE
const htmlDir = path.join(__dirname, '/reporteGafete.html')
var html   = fs.readFileSync(htmlDir, 'utf-8');
var options = {
    format: "letter",
    orientation: "landscape",
    border: "10mm",
    // header: {
    //     height: "45mm",   
    //     contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    // },
    // "footer": {
    //     "height": "28mm",
    //     "contents": {
    //         first: 'Cover page',
    //         2: 'Second page', // Any page number is working. 1-based index
    //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
    //     last: 'Last Page'
    //     }
    // }
}

const generarQR = (string) => {
    return new Promise((resolve, reject)=>{
        QRCode.toDataURL(string, function (err, url) {

            if(err){

                reject(err);
            }

            resolve(url);
        });

    });
}

exp.reporteGafete = () => {
    return new Promise((resolve, reject)=>{
        db.query('SELECT Email FROM Empleados.dbo.Correos WHERE Id = 1')
        .then((result)=>{
            var empleado  = JSON.stringify(result.recordset[0]);
            //var employee_encryption = encrypter.encrypt(empleado);
            //encriptar el texto
            encrypter
            .encrypt(empleado)
            .then(empleadoEncriptado => {

                console.log(empleadoEncriptado);

                generarQR(empleadoEncriptado)
                .then((qr)=>{

                    var document = {
                        html: html,
                        data: {
                            empleadoEncriptado,
                            qr
                        },
                        path: "./output.pdf"
                    };
        
                    pdf.create(document, options)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    });

                });

            })
            .catch(err => console.log('sdkjbsdfjkdf'));
            // encrypter.hash(empleado)
            // .then(hash=>{
            
            //     generarQR(hash)
            //     .then((qr)=>{

            //         var document = {
            //             html: html,
            //             data: {
            //                 empleado,
            //                 qr
            //             },
            //             path: "./output.pdf"
            //         };
        
            //         pdf.create(document, options)
            //         .then(res => {
            //             console.log(res)
            //         })
            //         .catch(error => {
            //             console.error(error)
            //         });
            //     })
            //     .catch(err=>console.log(err));
            // }).catch(err=> reject(err));
            
        })
        .catch((err)=>{
            reject(err);
        });
    });
}