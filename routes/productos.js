const express = require('express'); // Importamos express
const Producto = require('../models/producto'); // Importamos el modelo de producto
const router = express.Router(); // Creamos un router para manejar las rutas de productos

// Creamos un nuevo producto
router.post('/', async (req, res) => { // Ruta para crear un nuevo producto
  // Validamos que el cuerpo de la solicitud contenga los campos necesarios
  const { nombre, descripcion, precio, categoria, stock } = req.body;
  try {
    const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria, stock });
    await nuevoProducto.save();
    res.json(nuevoProducto);
  } catch (err) {
    res.status(500).send('Error al crear producto');
  }
});

// Obtener productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = router;
