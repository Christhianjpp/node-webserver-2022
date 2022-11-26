const { response, request } = require('express')
const { Categoria } = require('../models')


const obtenerCategorias = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    try {
        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
        ])


        res.status(200).json({
            total, categorias
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })

    }
}
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params
    try {
        const categoria = await Categoria.findById(id)
            .populate('usuario', 'nombre')

        res.status(200).json({
            categoria
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })

    }

    // const categoria = await Categoria.findById(id)
}

const crearCategoria = async (req, res) => {

    const nombre = req.body.nombre.toUpperCase()
    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    // Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)
    await categoria.save()

    res.status(201).json(categoria)
}

const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params
    // const nombre = req.body.nombre.toUpperCase()

    const { estado, usuario, ...data } = req.body
    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

        res.status(200).json({
            categoria
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'error'
        })

    }

    // const categoria = await Categoria.findById(id)
}
const borrarCategoria = async (req = request, res = response) => {
    const { id } = req.params

    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })

        res.status(200).json({
            categoria
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
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}