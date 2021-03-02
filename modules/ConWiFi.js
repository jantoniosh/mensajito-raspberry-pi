const Wifi = require('rpi-wifi-connection');
const wifi = new Wifi();

const conWiFi = async (ssid, password) => {
    console.log(ssid);
    console.log(password);
    await wifi.connect({ ssid: ssid, psk: password }).
        then(() => {
            console.log('Connected to network.');
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.conWiFi = conWiFi 