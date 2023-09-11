import * as fs from 'fs';
import * as path from 'path';

export function createImageFromDataUrl(dataUri: string, fileName: string): string {
    const splitted = dataUri.split(',');
    var data: string;
    if ( splitted.length > 2 || splitted.length === 0 ) {
        throw new Error('dataUri is not valid');
    } else if ( splitted.length === 1 ) {
        data = splitted[0];
    } else {
        data = splitted[1];
    }
    if ( data.trim() === '' ) {
        throw new Error('dataUri is empty');
    }
    var buf = Buffer.from(data, 'base64'); 
    const pathRoot = path.join(__dirname, '../public/images/activity');
    const fullPath = `${pathRoot}/${fileName}.png`;
    fs.writeFileSync(fullPath, buf);
    return `images/activity/${fileName}.png`;
}