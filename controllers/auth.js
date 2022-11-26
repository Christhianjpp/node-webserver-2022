const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");





const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {
        // Verificar el email
        const usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        // usuario activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado - false'
            })
        }

        // verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // gener jwt
        const token = await generarJWT(usuario.id)

        res.json({
            msg: 'Login ok',
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body

    try {
        const { nombre, img, correo } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            //crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }
            usuario = new Usuario(data)
            usuario.save()
        }

        // vereficar el estado del usuario
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // gener jwt
        const token = await generarJWT(usuario.id)




        res.json({
            usuario,
            token,
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}
module.exports = {
    login,
    googleSignIn
}