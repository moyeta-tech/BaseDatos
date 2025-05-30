const express = require('express'); // Importa el modelo Cliente
const Cliente = require('../models/cliente'); // Importa el modelo Cliente
const router = express.Router(); // Importa el modelo Cliente

// Crear nuevo cliente
router.post('/', async (req, res) => {
  const { nombre, correo, telefono, direccion } = req.body;
  try {
    const nuevoCliente = new Cliente({ name: nombre, correo, telefono, direccion });
    await nuevoCliente.save();
    res.redirect('/clientes');
  } catch (err) {
    res.status(500).send('Error al crear cliente');
  }
});

// Mostrar lista de clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.render('clientes', { clientes });
  } catch (err) {
    console.error("Error al obtener clientes:", err);
    res.status(500).send('Error al obtener clientes');
  }
});

// Mostrar formulario para crear nuevo cliente
router.get('/nuevo', (req, res) => {
  res.render('nuevoCliente');
});

// Mostrar formulario para editar cliente
router.get('/editar/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    res.render('editarCliente', { cliente });
  } catch (err) {
    console.error("Error al cargar cliente para editar:", err);
    res.status(500).send('Error al cargar cliente');
  }
});

// Guardar cambios de cliente editado
router.post('/editar/:id', async (req, res) => {
  const { nombre, correo, telefono, direccion } = req.body;
  try {
    await Cliente.findByIdAndUpdate(req.params.id, {
      name: nombre,
      correo,
      telefono,
      direccion
    });
    res.redirect('/clientes');
  } catch (err) {
    console.error("Error al actualizar cliente:", err);
    res.status(500).send('Error al actualizar cliente');
  }
});

// Eliminar cliente
router.post('/eliminar/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.redirect('/clientes');
  } catch (err) {
    res.status(500).send('Error al eliminar cliente');
  }
});

module.exports = router;
