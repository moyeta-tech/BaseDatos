const mongoose = require('mongoose'); // Importamos mongoose
const { Schema } = mongoose; // Desestructuramos mongoose para obtener el objeto Schema

const pedidoSchema = new Schema({ // Definimos el esquema para los pedidos
  cliente: { // Definimos el esquema para el cliente
    id: String,
    nombre: String,
    correo: String
  },
  productos: [ // Definimos un arreglo de productos
    {
      id_producto: String,
      nombre: String,
      precio_unitario: Number,
      cantidad: Number
    }
  ],
  fecha: { type: Date, default: Date.now }, // Fecha por defecto es la fecha actual
  estado: { type: String, enum: ['pendiente', 'enviado', 'entregado'], default: 'pendiente' }, // Estado del pedido con valores predefinidos
  total: Number // Total del pedido
  });

module.exports = mongoose.model('Pedido', pedidoSchema); // Exportamos el modelo Pedido basado en el esquema pedidoSchema
