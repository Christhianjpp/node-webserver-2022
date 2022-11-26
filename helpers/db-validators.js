const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');



const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El email ${correo}, ya está registrado en la BD`)

    }
}
const existeusuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ${id}, no existe`)

    }
}
const existeCategoria = async (id = '') => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`El id ${id}, no existe`)

    }
}
const existeProducto = async (id = '') => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`El id ${id}, no existe`)

    }
}

// validar colecciones permitidas
const coleccionesPermitidas = (coleccion = 0, colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección: ${coleccion} no es prmitida, ${colecciones}`)
    }
    return true
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeusuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas,
}