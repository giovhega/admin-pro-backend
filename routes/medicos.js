/**
 * ruta: ./routes/medicos
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicoById } = require('../controllers/medicos');
const router = Router();


router.get('/', getMedicos);

router.post('/', [

    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El nombre del hospital es necesario').isMongoId(),
    validarCampos
   
] , crearMedico);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
    check('hospital', 'El nombre del hospital es necesario').isMongoId(),
    validarCampos
],  actualizarMedico);

router.delete('/:id', validarJWT, borrarMedico);

router.get('/:id', validarJWT, getMedicoById);

module.exports = router;