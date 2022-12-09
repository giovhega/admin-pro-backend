const mongoose = require('mongoose');
//dbS3MrUW9bN0K9uZ
const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al levantar la base de datos');
    }

}

module.exports = {
    dbConnection
}