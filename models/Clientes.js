const mongoose = require('mongoose');
const { Schema } = mongoose;

const clienteSchema = new Schema({
    nombre: {type: String, required: true},
    correo: {type: String, required: true},
    telefono: String,
    direccion: String
});

module.exports = mongoose.model('Cliente', clienteSchema);