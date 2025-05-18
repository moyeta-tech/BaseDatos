const mongoose = require('mongoose');
const { Schema } = mongoose;

const pedidoSchema = new Schema({
    cliente: {type: Schema.Types.ObjectId, ref: 'Cliente', required: true},
    productos: [{
        producto: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        cantidad: {type: Number, required: true}
    }], 
    fecha: { type: Date, default: Date.now },
    estado: { type: String, enum: ['pendiente', 'enviado', 'entregado'], default: 'pendiente' }
});

module.exports = mongoose.model('Pedido', pedidoSchema);