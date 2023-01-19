const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(request, res = response) => {

    const desde = Number(request.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),

        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuarios = async(request, res = response) => {

    const { email, password } = request.body;
    
    try {
        const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El corro ya esta registrado'
            }); 
        }
        const usuario = new Usuario(request.body);

        //Encryptar pass
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token  = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        }); 
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error inesperado... revisar logs'
        });
    }

   
}

const actualizarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario por ese id'
            });
        }
        const {password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({email});
            if (existeEmail) {
                return res.status(404).json({
                    ok: false,
                    msg: 'ya existe un usario con ese email'
                }); 
            }
        }
        
        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'ya existe un usario con ese emailUsuario de google no puede cambiar el email'
            }); 
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado.'
        });
    } catch (error) {
        res.status(400).json({
            ok: true,
            usuario: usuarioActualizado
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}

