const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeusuarioPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, tieneRole, esAdminRole } = require('../middlewares')

const {
    usuariosGet,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    usuariosPost } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet)

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeusuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
],
    usuariosPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], usuariosPost)


router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeusuarioPorId),
    validarCampos
], usuariosDelete)

router.patch('/', usuariosPatch)

module.exports = router