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
            var fullData = [];

            obj.map(elementArray => {
                var keys = elementArray.data[0];
                var arrData = [];

                //console.log(obj[0].data);
                elementArray.data.map((arr, i) => {
                    let body ={};
                    if(i === 0){
                        return;
                    }
        
                    arr.map((x, ind) => {
                        body[keys[ind]] = x;
                    });
                    
                    arrData.push(body);
                    
                });

                fullData.push(arrData);
            })

            //obtener array de keys
            
            
            resolve(fullData);
            
        } catch (error) {

            reject(error);
            
        }

    });
}