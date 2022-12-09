const { Response } = require('express');
const bcrypt = require('bcryptjs');
const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const login = async(req, res = Response) => {

    const { email, password } = req.body;

    try {

        //Verificar email
        const usuarioDB = await usuario.findOne({email});

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                masg: 'Email no encontrado'
            });  
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            res.status(400).json({
                ok: false,
                masg: 'Contraseña no valida'
            });
        }

        const token  = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            masg: 'Por favor comuniquese con el administrador'
        });
    }
}

module.exports = {
    login
}