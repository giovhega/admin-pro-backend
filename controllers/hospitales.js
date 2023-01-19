const { response } = require('express');
const Hospital = require('../models/hospital');

const gethospitales = async(req,  res = response) => {

    const hospitales = await Hospital
                                .find()
                                .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    });

}


const crearHospital = async (req,  res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        hospital.usuario = uid;
        const hospitalDB = await hospital.save();
        
        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}


const actualizarHospital = async(req,  res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {

        const hopsitalDB = await Hospital.findById(id);

        if (!hopsitalDB) {
            res.status(404).json({
                ok: false,
                msg: 'el Hospital no existe'
            }); 
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        };

        const hopsitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});

        res.json({
            ok: true,
            msg: 'actualizarHospital',
            hospital: hopsitalActualizado
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        }); 
    }

}

const borrarHospital = async(req,  res = response) => {

    const id = req.params.id;

    try {

        const hopsitalDB = await Hospital.findById(id);

        if (!hopsitalDB) {
            res.status(404).json({
                ok: false,
                msg: 'el Hospital no existe'
            }); 
        }

        await Hospital.findByIdAndDelete(id);


        res.json({
            ok: true,
            msg: 'Hospital eliminado',
            
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        }); 
    }

}

module.exports = {
    gethospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}