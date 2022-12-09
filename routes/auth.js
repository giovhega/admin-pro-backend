/**
 *Path: /api/login
 */
const { Router } = require('express');
const { login } = require('../controllers/auth');
const { validationResult, check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password el obligatorio').not().isEmpty(),
    validarCampos
], login);

module.exports = router;