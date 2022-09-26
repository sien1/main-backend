const exp = module.exports;
const fs  = require('fs');
const path =  require('path');

exp.getImagesURL = async  (dir) => {
    
    const dirPath = path.join(process.env.BASE_RESOURCE_SERVER, dir);


    try {
        const files = await fs.promises.readdir(dirPath);
        return files;
    } catch (error) {
       return error;
    }
    
    
}