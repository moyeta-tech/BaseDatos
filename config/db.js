const mongoose = require('mongoose'); // Importamos mongoose

const connectDB = async () => { // Función para conectar a la base de datos
  try { // Intentamos conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI); // Conectamos a la base de datos usando la URI de MongoDB

    console.log('MongoDB Conectado');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB; // Exportamos la función connectDB para usarla en otros archivos
