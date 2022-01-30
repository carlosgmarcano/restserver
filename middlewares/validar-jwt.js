const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al UID
        const userAuthenticate = await Usuario.findById(uid);
        req.userAuthenticate = userAuthenticate;

        //Validar que sea un usuario activo
        if (!userAuthenticate) {
            return res.status(401).json({
                msg: "Token no valido - usuario no existe"
            })
        }

        //Validar que sea un usuario activo
        if (!userAuthenticate.estado) {
            return res.status(401).json({
                msg: "Token no valido - estado false"
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no valido"
        })
    }


}

module.exports = {
    validarJWT
}