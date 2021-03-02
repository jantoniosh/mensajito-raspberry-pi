const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const ConfigInfo = require('./modules/ConfigInfo');
const ConWifi = require('./modules/ConWiFi');
const DataBase = require('./clases/DataBase');
const Stream = require('./clases/Stream');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

const dataBase = new DataBase("localhost", "mensajito", "mensajito2021", "mensajito");
const stream = new Stream();

// Servidor Socket.io
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('stream', async (msg) => {
        console.log(msg);
        if (msg) {
            console.log('Iniciar Transmisión');
            let resp = await dataBase.getConfig();
            let info = await ConfigInfo.getInfo();
            stream.setDatos(resp.nombre, resp.ubicacion, resp.descripcion, info.link, info.mountpoint);
            stream.getConfigFile();
        }
        else {
            console.log('Parar Transmisión');
        }
    });
    socket.on('record', (msg) => {
        console.log(msg);
        if (msg) {
            console.log('Iniciar Grabación');
        }
        else {
            console.log('Parar Grabación');
        }
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


app.post("/config", (req, res) => {
    let nombre = req.body.estacion;
    let ubicacion = req.body.ubicacion;
    let descripcion = req.body.descripcion;
    let facebook = req.body.facebook;
    let instagram = req.body.instagram;
    let twitter = req.body.twitter;
    let web = req.body.web;
    let tags = req.body.tags;
    dataBase.postConfig(nombre, ubicacion, descripcion, facebook, instagram, twitter, web, tags);
    res.send('Datos OK');
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

// Servicios Obtener Nombres de Programas
app.get("/programas", async (req, res) => {
    let resp = await dataBase.getProgramas();
    res.send(resp)
});



http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

