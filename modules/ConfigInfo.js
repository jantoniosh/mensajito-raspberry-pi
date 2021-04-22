const { execSync } = require("child_process");
const macaddress = require('macaddress');
const df = require('df');

const run = (cwd, command) => {
    return execSync(command, { cwd, encoding: "utf8" });
}

const get_ip = (int, cwd) => {
    let a = run(cwd, `ifconfig ${int}`)
    a = `${a}`;
    let pos = a.indexOf('inet');
    let sal = '';
    if (pos >= 0) {
        sal = a.split('\n')[1].split(' ')[9];
    }
    else {
        sal = "Sin Red";
    }
    return sal;
}

const get_mac = (int) => {
    const resp = macaddress.one(int)
        .then((val) => {
            return val;
        });

    return resp;
}

const get_mem = () => {
    return new Promise ((resolve, reject) => {
        df((err, table) => {
            let mem = `${table[0].percent}%`;
            resolve(mem);
        }); 
    });
}

const get_link = (mac_e) => {
    let mountpoint = mac_e.replace(/:/g,"");
    return [mountpoint, `https://mensajito.mx/category/en-vivo/${mountpoint}`];
}

const getInfo = async () => {

    const iface_0 = "eth0";
    const iface_1 = "wlan0";
    let ip_e = "";
    let ip_w = "";
    let mac_e = "";
    let mac_w = "";
    let mem = "";


    ip_e = get_ip(iface_0);
    ip_w = get_ip(iface_1);

    mac_e = await get_mac(iface_0);
    mac_w = await get_mac(iface_1);
    mem = await get_mem();
    let [mountpoint, link] = get_link(mac_e);

    let info = {
        ip_eth0: ip_e,
        mac_eth0: mac_e,
        ip_wlan0: ip_w,
        mac_wlan0: mac_w,
        memoria: mem,
        mountpoint: mountpoint,
        link: link
    };
    return info;
}

exports.get_mem = get_mem
exports.getInfo = getInfo 