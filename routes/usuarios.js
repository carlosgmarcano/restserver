const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');
const { isValidRole, existEmail, isValidUserId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//POST
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mas de 6 letras').not().isEmpty().isLength({ min: 6 }),
    check('correo', 'ingrese un correo valido').isEmail().custom(existEmail),
    //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(isValidRole),
    validarCampos
], usuariosPost);

//PUT
router.put('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(isValidUserId),
    check('rol').custom(isValidRole),
    validarCampos
], usuariosPut);

//GET
router.get('/', usuariosGet);

//DELETE
router.delete('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(isValidUserId),
    validarCampos
], usuariosDelete);

module.exports = router;