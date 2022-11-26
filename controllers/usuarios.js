const { response, request } = require('express')
const bcrypt = require('bcryptjs');

const { Usuario } = require('../models');

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    //Todo validar limite - desde, sean un numero
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite))

    // const total = await usuario.countDocuments(query)

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios,
    })
}

const usuariosPost = async (req = request, res = response) => {

    // const {google,... resto} = req.body
    const { nombre, correo, password, rol } = req.body

    const usuario = new Usuario({ nombre, correo, password, rol })

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)

    // Guardar en la base de datos
    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async (req, res = response) => {

    const id = req.params.id
    const { _id, password, google, correo, ...resto } = req.body

    //Todo validar contra base de datos

    if (password) {
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })


    res.json({
        usuario
    })
}
const usuariosDelete = async (req, res = response) => {
    const id = req.params.id

    // Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id)
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })

    res.json(usuario)
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: ' Patch API - controlador'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}