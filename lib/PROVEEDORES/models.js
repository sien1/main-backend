const exp  = module.exports;

exp.nuevaPromesa = ()=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve("el carutal reverdece");
        }, 1000)
    })
}