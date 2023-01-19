const { Response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google.verify');

const login = async(req, res = Response) => {

    const { email, password } = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});

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

const googleSignIn = async(req, res = Response) => {

    try {
        const {email, name, picture} = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }
        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            masg: 'El token de google no es correcto'
        });
    }
}

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}