const express = require('express');
const Pedido = require('../models/pedido');
const Product = require('../models/product');
const router = express.Router();

router.post('/', async (req, res) => {
  const { cliente, productos, total } = req.body;

  const nuevoPedido = new Pedido({
    cliente,
    productos,
    total,
    estado: 'pendiente',
    fecha_pedido: new Date()
  });

  try {
    await nuevoPedido.save();

    // Actualizar stock
    for (const item of productos) {
      await Product.updateOne(
        { _id: item.id_producto },
        { $inc: { stock: -item.cantidad } }
      );
    }

    res.status(200).json({ mensaje: "Pedido creado y stock actualizado." });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar pedido");
  }
});

// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener pedidos');
  }
});

module.exports = router;
