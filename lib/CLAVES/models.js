const exp  = module.exports;
const db = require('../TOOLS/Databases/database');


exp.claveProyectosAno = ()=>{

    
    const uppercaseAlphabet = [...Array(26)].map((e,i)=>(i+10).toString(36).toUpperCase());
    const upcaLength = uppercaseAlphabet.length;
    const initialYear = 2021;
    const initialPosition = 24;
    const currentYear = 2060;


    return new Promise((resolve, reject) =>{

        console.log(uppercaseAlphabet);
        //verifica el año y la letra que le tiene que regresar
        let position =  currentYear - initialYear + initialPosition;
        let letterRepetition = Math.ceil(position/(upcaLength-1));
        let positionArray = position % upcaLength;
        let letter = uppercaseAlphabet[positionArray];
        let clave = letter.repeat(letterRepetition);

        console.log(clave);

        try {
            resolve(clave);
        } catch (error) {
            reject(error);
        }
    });
}

