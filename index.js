require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config.js');
//crear servidor express
const app = express();
app.use(cors());

app.use( express.static('public') );
//lectura y parseo del body
app.use(express.json());

dbConnection();
//mean_user
//h648wEsRUCSoxhfv
//Rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/uploads', require('./routes/uploads'));

app.listen( process.env.PORT, () => {
    console.log('corriendo por el puerto' + process.env.PORT);
} );