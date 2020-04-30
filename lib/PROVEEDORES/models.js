const exp  = module.exports;

exp.nuevaPromesa = ()=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve("amame otra vez");
        }, 1000)
    })
}