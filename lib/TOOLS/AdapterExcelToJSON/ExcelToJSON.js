const exp  = module.exports;
var   xlsx = require('node-xlsx');
const fs = require("fs");
const { debug } = require('console');

//Convertir excel en json

exp.excelToJSON = async (file)=>{
    //var obj = xlsx.parse(__dirname + '/clientes.xlsx');
   return await convertExcelToJson(file);
};


const convertExcelToJson = (file) => {
    return new Promise((resolve, reject) => {
        //var obj = xlsx.parse(__dirname, file);
        try {

            var obj = xlsx.parse(fs.readFileSync(file));

            //obtener array de keys
            var keys = obj[0].data[0];
            var arrData = [];
    
            //console.log(obj[0].data);
            obj[0].data.map((arr, i) => {
                let body ={};
                if(i === 0){
                    return;
                }
    
                arr.map((x, ind) => {
                    body[keys[ind]] = x;
                });
                
                arrData.push(body);
                
            });
            
            resolve(arrData);
            
        } catch (error) {

            reject(error);
            
        }

    });
}