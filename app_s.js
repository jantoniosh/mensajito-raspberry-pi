const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('stream', (msg) => {
                if (msg) {
                        console.log('Iniciar Transmisión');
                }
                else {
                        console.log('Parar Transmisión');
                }
        });
        socket.on('record', (msg) => {
                if (msg) {
                        console.log('Iniciar Grabación');
                }
                else {
                        console.log('Parar Grabación');
                }
        });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
