const mongoose = require('mongoose'); // Importamos mongoose
const { Schema } = mongoose; // Desestructuramos mongoose para obtener el objeto Schema

const clienteSchema = new Schema({ // Definimos el esquema del cliente
  name: { // Nombre del cliente
    type: String, 
    required: true
 },
  correo: { // Correo electrónico del cliente
    type: String,
    required: true 
},
  telefono: String,
  direccion: String 
});

module.exports = mongoose.model('Cliente', clienteSchema); // Exportamos el modelo Cliente para usarlo en otros archivos
