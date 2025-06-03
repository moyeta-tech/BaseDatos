const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: String,
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String, required: true },
    imagen: { type: String }
});

module.exports = mongoose.model('Product', productSchema);