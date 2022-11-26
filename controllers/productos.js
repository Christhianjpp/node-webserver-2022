const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    try {

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ])
        res.status(200).json({
            total,
            productos
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })
    }
}
const obtenerProducto = async (req, res = response) => {
    const { id } = req.params
    try {

        const producto = await Producto.findById(id)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')

        res.status(200).json({ producto })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })

    }
}

const crearProducto = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body
    const nombre = body.nombre.toUpperCase()

    const productoDB = await Producto.findOne({ nombre })

    if (productoDB) {
        return res.status(400).json({
            msg: `El ${productoDB.nombre}, ya existe`
        })
    }
    const data = {
        ...body,
        usuario: req.usuario._id,
        nombre
    }

    try {
        const producto = new Producto(data)
        await producto.save()

        res.status(200).json(producto)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })
    }

}

const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params
    // const nombre = req.body.nombre.toUpperCase()

    const { estado, usuario, ...data } = req.body

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = req.usuario._id

    try {
        const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

        res.status(200).json({
            producto
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })

    }
}

const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params

    try {
        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

        res.status(200).json({
            producto
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })

    }

    // const categoria = await Categoria.findById(id)
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
}