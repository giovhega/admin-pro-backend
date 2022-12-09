/**
 * ruta: ./routes/todo
 */

const { Router } = require('express');
const { busquedas, getDocumentosCollecion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.get('/:busqueda', validarJWT, busquedas);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosCollecion);

module.exports = router;