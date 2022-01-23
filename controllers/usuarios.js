const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'no name', apiKey } = req.query;

    res.json({
        msg: "get API - Controller",
        q,
        nombre,
        apiKey
    });
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        msg: "Put API - Controller",
        id
    });
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: "Post API - Controller",
        nombre,
        edad
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: "Delete API - Controller"
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}