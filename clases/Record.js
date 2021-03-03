const { exec } = require("child_process");

class Record {
    constructor() {
        this.nombre = '';
        this.fecha = '';
        this.archivo = '';
    }

    setFecha() {
        const hoy = new Date();
        this.fecha = `${hoy.getDate()}_${hoy.getMonth() + 1}_${hoy.getFullYear()}_${hoy.getHours()}_${hoy.getMinutes()}_${hoy.getSeconds()}`;
    }

    setDatos(nombre) {
        this.setFecha();
        this.nombre = nombre.replace(/ /g,"_");
        this.archivo = `/home/pi/audios/${this.nombre}_${this.fecha}.mp3`;
        console.log(this.archivo);
    }

    runRecord() {
        exec(`arecord -f dat --device="mensajito" - | lame - ${this.archivo} &`, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                return;
            }
            if (stderr) {
                return;
            }
        });
    }

    stopRecord() {
        exec('sudo killall arecord', (error, stdout, stderr) => {
            if (error) {
                return;
            }
            if (stderr) {
                return;
            }
        });
    }

}

module.exports = Record