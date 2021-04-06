const JSON_categoria = (config, info) => {
    let json_socket = {
        "name": config.nombre,
        "description": config.descripcion,
        "slug": info.mountpoint,
        "facebook_url": config.facebook,
        "twitter_url": config.twitter,
        "instagram_url": config.instagram,
        "web_url": config.web,
        "locacion": config.ubicacion,
        "mixcloud": config.mixcloud,
        "trans_url": `https://radio.mensajito.mx/${info.mountpoint}`
    }
    return json_socket;
}

exports.JSON_categoria = JSON_categoria;