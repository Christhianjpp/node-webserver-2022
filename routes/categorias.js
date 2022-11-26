const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria } = require('../controllers/categorias');

const { existeCategoria } = require('../helpers/db-validators');
const { tieneRole, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');



const router = Router();

// obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'el id no es válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria)

// Crear categoria - privado - cualquier persona con un token
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria
)

// actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'el id no es válido').isMongoId(),
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria)

// Borrar - privado - Soldo Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'el id no es válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria)


module.exports = router