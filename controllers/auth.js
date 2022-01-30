const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt-generate");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - correo"
            });
        }

        //Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - estado"
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos - password"
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador"
        })
    }
}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;
    try {
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //Se debe crear
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'

            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        //usuario no activo en BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: `usuario ${correo}, Bloqueado!!`
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login google OK',
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'Error de autenticacion google'
        })
    }


}

module.exports = {
    login,
    googleSignIn
}