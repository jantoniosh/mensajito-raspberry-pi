const ConfigParser = require('configparser');
const { exec } = require("child_process");
const axios = require('axios');

class Stream {
    constructor() {
        this.link = '';
        this.nombre = '';
        this.ubicacion = '';
        this.descripcion = '';
        this.mountpoint = '';
        this.getMointPoint = '';
        this.genero = 'mensajito';
    }

    setDatos(nombre, ubicacion, descripcion, link, mountpoint) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.descripcion = descripcion;
        this.link = link;
        this.mountpoint = mountpoint;
    }

    getDatos() {
        console.log(this.link);
        console.log(this.nombre);
        console.log(this.ubicacion);
        console.log(this.descripcion);
        console.log(this.mountpoint);
    }

    getConfigFile() {
        const config = new ConfigParser();
        config.addSection('general');
        config.addSection('input');
        config.addSection('icecast2-0');
        // [general]
        config.set('general', 'duration', '0');
        config.set('general', 'bufferSecs', '60');
        config.set('general', 'reconnect', 'yes');
        // [input]
        config.set('input', 'device', 'mensajito');
        config.set('input', 'sampleRate', '48000');
        config.set('input', 'bitsPerSample', '16');
        config.set('input', 'channel', '2');
        // [icecast2-0]
        config.set('icecast2-0', 'bitrateMode', 'vbr');
        config.set('icecast2-0', 'bitrate', '128');
        config.set('icecast2-0', 'format', 'mp3');
        config.set('icecast2-0', 'quality', '0.6');
        config.set('icecast2-0', 'server', 'mensajito.mx');
        config.set('icecast2-0', 'port', '8000');
        config.set('icecast2-0', 'password', 'mensajito$1192');
        config.set('icecast2-0', 'mountPoint', this.mountpoint)
        config.set('icecast2-0', 'sampleRate', '48000');
        config.set('icecast2-0', 'channel', '2');
        config.set('icecast2-0', 'name', this.nombre);
        config.set('icecast2-0', 'description', this.descripcion);
        config.set('icecast2-0', 'genre', this.genero);
        config.set('icecast2-0', 'public', 'yes');
        config.write('/etc/darkice.cfg');
    }

    runStream() {
        exec('sudo darkice &', (error, stdout, stderr) => {
            if (error) {
                return;
            }

            if (stderr) {
                return;
            }
        });
    }

    stopStream() {
        exec('sudo killall darkice', (error, stdout, stderr) => {
            if (error) {
                return;
            }

            if (stderr) {
                return;
            }
        });
    }

    readListeners() {
        const resp = axios.get(`https://${this.link}.xspf`)
            .then((response) => {
                let data = response.data;
                let line = data.split('\n')[12];
                let num = parseInt(line.split(":")[1]);
                return num;
            })
            .catch((error) => {
                return 0;
            })
        return resp;
    }
}

module.exports = Stream