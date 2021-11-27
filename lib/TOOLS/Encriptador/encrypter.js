const exp     = module.exports;
const db      = require("../Databases/database"); 
const dotenv  = require('dotenv');
const crypto  = require('crypto');
const { Console } = require("winston/lib/winston/transports");
const fs = require('fs');
const RSA = require('hybrid-crypto-js').RSA;
const Crypt = require('hybrid-crypto-js').Crypt;

// const publicKey = fs.readFileSync("SIENMOBILEPUBLIC.pem", { encoding: "utf8" });
// const privateKey = fs.readFileSync("SIENMOBILEPRIVATE.pem", { encoding: "utf8" });

const crypt = new Crypt({
    md:'sha512',
    aesKeySize: 192
});

dotenv.config();

const secret = process.env.SECRET_ENCRYPTER;

exp.hash = (myPlaintextPassword) => {
    const saltRounds = 10;
    if(typeof myPlaintextPassword != 'string') {
        myPlaintextPassword = myPlaintextPassword.toString();
    }

    return new Promise((resolve, reject)=>{
        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {

            let query = `INSERT INTO [Empleados].[dbo].[Hashes]
                    ([Hash]
                    ,[Activo]
                    ,[Alta])
            VALUES
                    ('${hash}'
                    ,1
                    ,GETDATE())`;

            db.query(query)
            .then(result=>{
                resolve(hash);
            })
            .catch(err=>{
                reject(err);
            })
        });
    });
}

// exp.encrypt = (stringToEncrypt) => {

//     return new Promise((resolve, reject) => {
//         let encryptedString = '';

//         encryptedString = crypt.encrypt(publicKey, stringToEncrypt);
 
//         if(encryptedString === '') {

//             reject('Error, no se pudo encriptar el texto');
//         }

//         resolve(encryptedString);

//     });
    
// }


exp.getRandomString = (length) => {
    const id = crypto.randomBytes(length).toString('hex');
    return id;
}


exp.compare = () => {

}

//
exp.generarParDeLlaves = () => {
    return new Promise((reject, resolve) => {
        const rsa = new RSA();
        let publicKey = '';
        let privateKey = ''; 
        
        rsa.generateKeyPair((keyPair) => {
            publicKey = keyPair.publicKey;
            privateKey = keyPair.privateKey;

            if(publicKey === '' && privateKey === '') {
                reject('Error, no se crearon las llaves');
            }
    
            fs.writeFile('SIENMOBILEPRIVATE.pem', privateKey, err=> {
                if(err) reject(err);
            });
    
            fs.writeFile('SIENMOBILEPUBLIC.pem', publicKey, err => {
                if(err) reject(err);
            });
    
            resolve('Se han creado las llaves');

        },1024);

    });
};

exp.encrypter = async() => {
    const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
    console.log(hash);
}






// export default encriptador;