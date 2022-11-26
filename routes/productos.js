const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto } = require('../controllers/productos');


const { existeCategoria, existeProducto } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();

// obtener todas las categorias - publico
router.get('/', obtenerProductos)

// Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'el id no es válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto)

// Crear categoria - privado - cualquier persona con un token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es una categoria válida').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto)

// actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'el id no es válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto)

// Borrar - privado - Soldo Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'el id no es válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto)


module.exports = router