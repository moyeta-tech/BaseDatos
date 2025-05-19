const express = require('express');
const Cliente = require('../models/cliente');
const router = express.Router();

// Crear un nuevo cliente
router.post('/', async (req, res) => {
  const { nombre, correo, telefono, direccion } = req.body;
  try {
    const nuevoCliente = new Cliente({ nombre, correo, telefono, direccion });
    await nuevoCliente.save();
    res.redirect('/clientes'); // Redirige a la lista de clientes
  } catch (err) {
    res.status(500).send('Error al crear cliente');
  }
});

// Obtener clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.render('clientes', { clientes });
  } catch (err) {
    console.error("Error al obtener clientes:", err);
    res.status(500).send('Error al obtener clientes');
  }
});

module.exports = router;