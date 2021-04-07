const { exec } = require("child_process");
const { nameUSB } = require("./ConUSB");

const DeleteAudio = (archivo) => {
    let cmd = `sudo rm /home/pi/audios/${archivo}`;
    console.log(cmd);
    let resp = new Promise(async (resolve, reject) => {
        await exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
    return resp;
}

const CopyAudio = async (archivo) => {
    let val = await nameUSB();
    if (val.toString() !== "false") {
        let cmd = `sudo cp /home/pi/audios/${archivo} ${val}/${archivo}`;
        console.log(cmd);
        await exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                return;
            }
        });
    }
    return val
}

exports.DeleteAudio = DeleteAudio
exports.CopyAudio = CopyAudio