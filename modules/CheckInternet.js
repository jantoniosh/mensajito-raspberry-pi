const fetch = require("node-fetch");

const checkInternet = async () => {
    try {
        const online = await fetch("https://radio.mensajito.mx/");
        console.log(online.status);
        return online.status >= 200 && online.status < 300; // either true or false
    } catch (err) {
        return false; // definitely offline
    }
}

exports.checkInternet = checkInternet;