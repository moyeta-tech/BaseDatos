const mongoose = require('mongoose'); // Importamos mongoose
const { Schema } = mongoose; // Desestructuramos mongoose para obtener el objeto Schema

const pedidoSchema = new Schema({ // Definimos el esquema del pedido
  cliente: {
    id: String,
    name: String,
    email: String
  },
  productos: [{
    id_producto: String,
    nombre: String,
    precio_unitario: Number,
    cantidad: Number
  }],
  fecha_pedido: { type: Date, default: Date.now },
  estado: { type: String, enum: ['pendiente', 'enviado', 'entregado'], default: 'pendiente' },
  total: Number
});

module.exports = mongoose.model('Pedido', pedidoSchema);
