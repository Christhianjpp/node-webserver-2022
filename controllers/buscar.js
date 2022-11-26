const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productoporcategoria',
]



const buscarUsuarios = async (termino = '', res = response) => {

    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex, }, { correo: regex, }],
        $and: [{ estado: true }]
    })

    return res.json({
        results: usuarios
    })
}

const buscarProductos = async (termino = '', res = response) => {
    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre')

    return res.json({
        results: productos
    })
}

const buscarCategorias = async (termino = '', res = response) => {
    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
        const categoria = await Categoria.findById(termino)

        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const categorias = await Categoria.find({ nombre: regex, estado: true })


    return res.json({
        results: categorias
    })
}

const buscarProductosPorCategoria = async (termino = '', res = response) => {
    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
        const producto = await Producto.find({ categoria: ObjectId(termino), estado: true })
            .populate('categoria', 'nombre')

        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const nombre = termino.toUpperCase()
    const [categoria] = await Categoria.find({ nombre, estado: true })

    // verifico si la categoria existe
    if (!categoria) {
        return res.status(400).json({
            results: []
        })
    }

    const producto = await Producto.find({ categoria: categoria._id, estado: true })
        .populate('categoria', 'nombre')

    return res.json({
        results: (producto) ? [producto] : []
    })

}


// Verifica si la colección es permitida
const buscar = async (req, res = response) => {
    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son :${coleccionesPermitidas}`
        })
    }



    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        case 'productoporcategoria':
            buscarProductosPorCategoria(termino, res)
            break;
        default:
            res.status(500).json({
                msg: 'Falta'
            })
    }

}


module.exports = {
    buscar
}