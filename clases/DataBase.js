const mysql = require('mysql');

class DataBase {
    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.con = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });

        this.con.connect(function (err) {
            if (err) throw err;
        });
    }

    getConfig() {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM configuracion WHERE id='1'";
            this.con.query(sql, (err, rows) => {
                if (err) throw err;
                let nombre = '';
                let ubicacion = '';
                let descripcion = '';
                let facebook = '';
                let instagram = '';
                let twitter = '';
                let mixcloud = '';
                let web = '';
                let tags = '';
                rows.forEach((row) => {
                    nombre = row.nombre;
                    ubicacion = row.ubicacion;
                    descripcion = row.descripcion;
                    facebook = row.facebook;
                    instagram = row.instagram;
                    twitter = row.twitter;
                    mixcloud = row.mixcloud;
                    web = row.web;
                    tags = row.tags;
                });
                let res = {
                    nombre: nombre,
                    ubicacion: ubicacion,
                    descripcion: descripcion,
                    facebook: facebook,
                    instagram: instagram,
                    twitter: twitter,
                    mixcloud: mixcloud,
                    web: web,
                    tags: tags
                };
                resolve(res);
            });
        });
    }

    postConfig(nombre, ubicacion, descripcion, facebook, instagram, twitter, mixcloud, web, tags) {
        let sql = `UPDATE configuracion SET nombre='${nombre}', ubicacion='${ubicacion}', descripcion='${descripcion}', facebook='${facebook}', instagram='${instagram}', twitter='${twitter}', mixcloud='${mixcloud}',web='${web}', tags='${tags}' WHERE id='1'`;
        this.con.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
        });
    }

    getProgramas() {
        return new Promise((resolve, reject) => {
            this.con.query("SELECT id, nombre FROM programas", (err, rows) => {
                if (err) throw err;
                resolve(rows);
            });
        });
    }

    postPrograma(nombre) {
        let sql = `INSERT INTO programas (nombre) VALUES ('${nombre}')`;
        this.con.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result.affectedRows + " record(s) updated");
        });
    }

    deletePrograma(id) {
        let sql = `DELETE FROM programas WHERE id = '${id}'`;
        this.con.query(sql, (err, result) => {
            if (err) throw err;
        });
    }
}

module.exports = DataBase;