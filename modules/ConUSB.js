const path = require('path');
const fs = require('fs');

const detect_usb = () => {
    const dirname = '/media/pi';
    return fs.promises.readdir(dirname).then(files => {
        return files.length !== 0;
    });
}

const list_files = () => {
    return new Promise(async (resolve, reject) => {
        const dirname = '/media/pi';
        let dir = await detect_usb();
        console.log(dir);
        if (dir) {
            fs.readdir(dirname, (err, filenames) => {
                if (err) {
                    onError(err);
                    return;
                }
                let usb = filenames[0];
                let usbPath = `${dirname}/${usb}`;
                fs.readdir(usbPath, (err, filenames) => {
                    let files_jpg = filenames.filter(el => path.extname(el) === '.jpg');
                    let files_png = filenames.filter(el => path.extname(el) === '.png');
                    let files = files_jpg.concat(files_png);
                    // console.log(files);
                    resolve(files);
                });
            });
        }
        else {
            resolve("sin archivos");
        }
    });
};

exports.detect_usb = detect_usb;
exports.list_files = list_files;
