const { exec } = require("child_process");

const checkAudioUSB = async () => {
    let cmd = `aplay -l`;
    let resp = new Promise(async (resolve, reject) => {
        await exec(cmd, (error, stdout, stderr) => {
            if (error) {
                return;
            }
            resolve(stdout.search("card 2"));
        });
    });
    return resp;
}

exports.checkAudioUSB = checkAudioUSB;