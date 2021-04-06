const express = require('express')
const cors = require('cors');
const ConfigInfo = require('./modules/ConfigInfo');
const ConWifi = require('./modules/ConWiFi');
const ConUSB = require('./modules/ConUSB');
const AudioUSB = require('./modules/AudioUSB');
const DataBase = require('./clases/DataBase');
const Stream = require('./clases/Stream');
const Record = require('./clases/Record');
const io_client = require("socket.io-client");
const { JSON_categoria } = require('./modules/PrettyFun');

const socket_gen = new io_client('https://socket.mensajito.mx/', {
    transports: ['websocket', 'polling', 'flashsocket']
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;
const dataBase = new DataBase("localhost", "mensajito", "mensajito2021", "mensajito");
const stream = new Stream();
const record = new Record();
const usbDetect = require('usb-detection');
const { checkInternet } = require('./modules/CheckInternet');
usbDetect.startMonitoring();


// Servidor Socket.io
io.on('connection', (socket) => {
    console.log('a user connected');

    const contador = async (mt) => {
        let escuchas = await stream.readListeners();
        socket.emit("escuchas", escuchas);
    }

    let event_contador;
    socket.on('stream', async (msg) => {
        let resp = await dataBase.getConfig();
        let info = await ConfigInfo.getInfo();
        console.log('Stream:', msg);
        if (msg) {
            let audio = await AudioUSB.checkAudioUSB();
            socket.emit("audio_usb", audio);
            let internet = await checkInternet();
            console.log('Internet:', internet);
            socket.emit("internet", internet);
            stream.setDatos(resp.nombre, resp.ubicacion, resp.descripcion, info.link, info.mountpoint);
            stream.getConfigFile();
            stream.readListeners();
            event_contador = setInterval(async () => { await contador(info.mountpoint) }, 1000);
            stream.runStream();
        }
        else {
            clearInterval(event_contador);
            console.log('Parar Transmisión');
            stream.stopStream();
        }
    });

    socket.on('record', async (msg) => {
        console.log('Record:', msg);
        let audio = await AudioUSB.checkAudioUSB();
        socket.emit("audio_usb", audio);
        let rec = msg.split('@');
        if (rec[0] === 'true') {
            record.setDatos(rec[1]);
            record.runRecord();
        }
        else {
            record.stopRecord();
        }
    });

    socket.on('imagen', async (msg) => {
        if (msg.tipo === 'Imagen Transmisor') {
            ConUSB.copyFile(msg.nombre);
        }
        else if (msg.tipo === 'Imagen Plataforma' || msg.tipo === 'Imagen Header') {
            let config = await dataBase.getConfig();
            let info = await ConfigInfo.getInfo();
            let tipo = '';
            let json_socket = JSON_categoria(config, info);
            msg.tipo === 'Imagen Plataforma' ? tipo = 'logo' : tipo = 'header';
            ConUSB.copyLogo(msg.nombre, info.mountpoint, tipo);
            socket_gen.emit("categoria", json_socket);
        }
    });

    socket.on('disconnect', () => {
        console.log("Usuario Desconectado");
    });
});


app.get('/', (req, res) => {
    res.send('Hello Mensajito!');
});

// Servicios de Información
app.get('/info', async (req, res) => {
    let a = await ConfigInfo.getInfo();
    res.json(a);
});

// Servicios de Configuración
app.get("/config", async (req, res) => {
    let resp = await dataBase.getConfig();
    res.send(resp)
});


app.post("/config", async (req, res) => {
    let data = req.body;
    // Guardando Datos en Base de Datos Local
    console.log(data);
    dataBase.postConfig(data.nombre, data.ubicacion, data.descripcion, data.facebook, data.instagram, data.twitter, data.mixcloud, data.web, data.tags);
    // Enviando Datos a Internet
    let config = await dataBase.getConfig();
    let info = await ConfigInfo.getInfo();
    let json_socket = JSON_categoria(config, info);
    socket_gen.emit("categoria", json_socket);
    res.send(json_socket);
});

// Servicios de WiFi
app.post("/wifi", async (req, res) => {
    let ssid = req.body.ssid;
    let pass = req.body.password;
    await ConWifi.conWiFi(ssid, pass);
    res.send("Connected");
});

// Servicios Agregar Programas
app.post("/programa", (req, res) => {
    let nombre = req.body.nombre;
    dataBase.postPrograma(nombre);
    res.send('Datos OK');
});

app.post("/programa_del", (req, res) => {
    let id = req.body.id;
    dataBase.deletePrograma(id);
    res.send('Datos OK');
});

// Servicios Obtener Nombres de Programas
app.get("/programas", async (req, res) => {
    let resp = await dataBase.getProgramas();
    res.send(resp)
});

app.get("/usb_files", async (req, res) => {
    let a = await ConUSB.list_files();
    res.send(a);
});

app.get("/usb_files_audio", async (req, res) => {
    let a = await ConUSB.list_files_audio();
    res.send(a);
});

app.get("/get_img", async (req, res) => {
    res.sendFile('/var/www/html/img/fondo.jpg');
});

http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

