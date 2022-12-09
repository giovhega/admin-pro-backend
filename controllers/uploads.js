const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    const tiposValidos = ['hospitales', 'usuarios', 'medicos'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: falso,
            msg: 'Error no es valido el tipo'
        });
    }

    //validar que exista archivo
    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: falso,
            msg: 'ENo hay ningun archivo'
        });
    }
    const files = req.files.imagen;
    const nombreCortado = files.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: falso,
            msg: 'Extension del archivo del invalida'
        });
    }

    const nombreArchivo = `${ uuidv4() }.${extensionArchivo}`;

    //path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    //mover la imagen

    files.mv(path, (err) => {
        if (err) {
            console.log(err);
            res.status(400).json({
                ok: false,
                msg: 'error al mover el archivo'
            }); 
        }

        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });

}

const retornaImagen = (req, res) => {
    const tipo = req.params.tipo;
    const foto   = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileUpload,
    retornaImagen
}