const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models')


const cargarArchivo = async (req, res = response) => {

    try {
        //imagenes
        // const nombre = await subirArchivo(req.files, ['zip'], 'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({
            nombre
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: error
        })

    }
}


const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario: ${id}`
                })
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto: ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({ msg: 'se me olvidó' })
    }

    // Limpiar imágen previa
    if (modelo.img) {
        // borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }


    // subir archivo
    const nombre = await subirArchivo(req.files, undefined, coleccion)
    modelo.img = await nombre;

    await modelo.save();

    res.json(modelo)
}


const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario: ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto: ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'se me olvidó' })
    }

    // Limpiar imágen previa
    if (modelo.img) {
        // borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    const pathNoImagen = path.join(__dirname, '../assets/no-image.jpg')

    res.sendFile(pathNoImagen)

}


const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario: ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto: ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'se me olvidó' })
    }

    // Limpiar imágen previa
    if (modelo.img) {
        // borrar imagen
        const nombreArr = modelo.img.split('/')

        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id] = nombre.split('.')

        cloudinary.uploader.destroy(public_id)

    }


    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

    // subir archivo
    modelo.img = secure_url

    await modelo.save();

    res.json(modelo)
}



module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}