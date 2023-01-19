const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico
                            .find()
                            .populate('usuario', 'nombre')
                            .populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos
    });

}

const crearMedico = async(req, res = response) => {

    const medico = new Medico({
        usuario: req.uid,
        ...req.body
    });

    try {
       
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;
    try {

       
        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por ese id'
            });
        }

        const medicoCambios = {
            usuario: uid,
            ...req.body
        };
    
        const medicoActualizado = await Medico.findByIdAndUpdate(id, medicoCambios, {new: true});

        res.json({
            ok: true,
            msg: 'actualizarMedico',
            medico: medicoActualizado
        });

    } catch (error) {
         res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarMedico = async(req, res = response) => {

    const id = req.params.id;
    try {
        const medicoDB = Medico.findById(id);
        if (!medicoDB) {
            res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por ese id'
            });
        }

        await Medico.findByIdAndDelete(id);
        
        res.json({
            ok: true,
            msg: 'Medico eliminado',
        });

    } catch (error) {
         res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const getMedicoById = async(req, res = response) => {

    const id = req.params.id;
    try {
        const medicos = await Medico
                            .findById(id)
                            .populate('usuario', 'nombre')
                            .populate('hospital', 'nombre');

        res.json({
            ok: true,
            medicos
        });
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Medico no encontrado'
        }); 
    }

}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}