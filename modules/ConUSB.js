const path = require('path');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
const { exec } = require("child_process");

const detectUSB = () => {
    const dirname = '/media/pi';
    return fs.promises.readdir(dirname).then(files => {
        return files.length !== 0;
    });
}

const nameUSB = async () => {
    const dirname = '/media/pi';
    return new Promise(async (resolve, reject) => {
        let dir = await detectUSB();
        if (dir) {
            fs.readdir(dirname, (err, filenames) => {
                if (err) {
                    onError(err);
                    return;
                }
                let usb = filenames[0];
                let usbPath = `${dirname}/${usb}`;
                resolve(usbPath);
            });
        }
        else {
            resolve(false);
        }
    });
}

const list_files = () => {
    return new Promise(async (resolve, reject) => {
        const dirname = '/media/pi';
        let dir = await detectUSB();
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
                    resolve(files_jpg);
                });
            });
        }
        else {
            resolve(["sin archivos"]);
        }
    });
};

const list_files_audio = () => {
    return new Promise((resolve, reject) => {
        const dirname = '/home/pi/audios';
        const files_audio = fs.readdir(dirname, (err, filenames) => {
            let files_mp3 = filenames.filter(el => path.extname(el) === '.mp3');
            resolve(files_mp3);
        });
    });
};

const copyFile = async (archivo) => {
    const dirname = '/media/pi';
    let dir = await detectUSB();
    console.log(dir);
    if (dir) {
        fs.readdir(dirname, (err, filenames) => {
            if (err) {
                onError(err);
                return;
            }
            let usb = filenames[0];
            let usbPath = `${dirname}/${usb}`;
            let cmd = `sudo cp ${usbPath}/${archivo} /var/www/html/img/fondo.jpg`;
            // Aquí se copia el archivo
            console.log(cmd);
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    return;
                }

                if (stderr) {
                    return;
                }
            });
            cmd = 'sudo rm -r /home/pi/.cache/chromium/Default';
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    return;
                }

                if (stderr) {
                    return;
                }
            });
        });
    }
}

const copyLogo = async (archivo, id_trans, tipo) => {
    const dirname = '/media/pi';
    let dir = await detectUSB();
    console.log(dir);
    if (dir) {
        fs.readdir(dirname, (err, filenames) => {
            if (err) {
                onError(err);
                return;
            }
            let usb = filenames[0];
            let usbPath = `${dirname}/${usb}/${archivo}`;
            const form = new FormData();
            const stream = fs.createReadStream(usbPath);
            form.append('imagen', stream);
            form.append('id', id_trans);
            form.append('tipo', tipo);
            const formHeaders = form.getHeaders();
            axios.post('https://subirimagen.mensajito.mx/upload', form, {
                headers: {
                    ...formHeaders,
                },
            })
                .then((response) => {
                    // console.log(response);
                })
                .catch((error) => {
                    // console.log(error);
                });
        });
    }
}

exports.detectUSB = detectUSB;
exports.list_files = list_files;
exports.list_files_audio = list_files_audio;
exports.copyFile = copyFile;
exports.copyLogo = copyLogo;
exports.nameUSB = nameUSB;