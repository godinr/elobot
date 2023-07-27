const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const getAssetMap = () => {
    const assetsPath = path.join(__dirname, '../assets');    
    const assetsFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.png'));


    const map = new Map();
    for (const file of assetsFiles){
        const filePath = path.join(assetsPath, file);

        let fullPath;
        if (os.platform() === 'win32'){
            fullPath = filePath.split('\\');
        }else {
            fullPath = filePath.split('/');
        }
        
        
        const key = fullPath[fullPath.length-1].split('.')[0].replace('p','+').replace('m', '-');
        const relativePath = fullPath.slice(-2).join('/');
        
        
        const name = relativePath.split('/')[1];
        const asset = {
            name: name,
            path: relativePath 
        }

        map.set(key, asset);
    }

    return map;

}

getAssetMap()

module.exports = {
    getAssetMap
}