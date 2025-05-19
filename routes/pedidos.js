const express = require('express');
const Pedido = require('../models/pedido');
const Product = require('../models/product');
const Cliente = require('../models/cliente');
const router = express.Router();

// Mostrar formulario y lista de pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    const clientes = await Cliente.find();
    const productos = await Product.find();
    res.render('pedidos', { pedidos, clientes, productos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener pedidos');
  }
});

// Crear un nuevo pedido
router.post('/', async (req, res) => {
  try {
    // Recibe los IDs y busca los datos completos
    const clienteDB = await Cliente.findById(req.body.cliente_id);
    const productoDB = await Product.findById(req.body.producto_id);

    const cantidad = parseInt(req.body.cantidad, 10);
    const total = productoDB.price * cantidad;

    const pedido = new Pedido({
      cliente: {
        id: clienteDB._id,
        name: clienteDB.nombre,
        email: clienteDB.correo
      },
      productos: [{
        id_producto: productoDB._id,
        nombre: productoDB.name,
        precio_unitario: productoDB.price,
        cantidad: cantidad
      }],
      total: total,
      estado: 'pendiente',
      fecha_pedido: new Date()
    });

    await pedido.save();

    // Actualizar stock
    await Product.updateOne(
      { _id: productoDB._id },
      { $inc: { stock: -cantidad } }
    );

    res.redirect('/pedidos');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar pedido");
  }
});

module.exports = router;