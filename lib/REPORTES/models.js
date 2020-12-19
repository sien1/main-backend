const exp  = module.exports;
const fs = require("fs");
const db = require('../TOOLS/Databases/database');
const pdf = require('pdf-creator-node');
const { dirname } = require("path");


//READ HTML TEMPLATE
var html    = fs.readFileSync('reporteGafete.html', 'utf8');
var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
    },
    "footer": {
        "height": "28mm",
        "contents": {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page'
        }
    }
}

exp.reporteGafete = () => {
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM Empleados.dbo.Empleados WHERE Id = 1')
        .then((result)=>{
            var document = {
                html: html,
                data: {
                    result
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
        })
        .catch((err)=>{
            reject(err);
        });
    });
}