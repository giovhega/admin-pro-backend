require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config.js');
//crear servidor express
const app = express();
app.use(cors());
dbConnection();
//mean_user
//h648wEsRUCSoxhfv
//Rutas
app.get('/', (request, response) => {
    response.json({
        ok: true,
        msg: 'Hola mundo'
    });
});

app.listen( process.env.PORT, () => {
    console.log('corriendo por el puerto' + process.env.PORT);
} );