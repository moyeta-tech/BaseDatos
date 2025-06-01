const express = require('express'); // Importa express
const Cliente = require('../models/cliente'); // Importa el modelo Cliente
const router = express.Router(); // Crea el router

// Crear nuevo cliente
router.post('/', async (req, res) => {
  const { nombre, correo, telefono, direccion } = req.body;
  try {
    // Verificar si ya existe un cliente con el mismo correo
    const clienteExistente = await Cliente.findOne({ correo });

    if (clienteExistente) {
      return res.redirect('/clientes?mensaje=Error: Ya existe un cliente con ese correo');
    }

    const nuevoCliente = new Cliente({ nombre, correo, telefono, direccion });
    await nuevoCliente.save();
    res.redirect('/clientes?mensaje=Cliente creado exitosamente');
  } catch (err) {
    console.error("Error al crear cliente:", err);
    res.redirect('/clientes?mensaje=Error al crear cliente');
  }
});


// Mostrar lista de clientes con buscador
router.get('/', async (req, res) => {
  try {
    const query = req.query.busqueda;
    const mensaje = req.query.mensaje; // 👈 agregamos esto
    let clientes;

    if (query) {
      clientes = await Cliente.find({
        $or: [
          { nombre: { $regex: query, $options: 'i' } },
          { correo: { $regex: query, $options: 'i' } }
        ]
      });
    } else {
      clientes = await Cliente.find();
    }

    res.render('clientes', { clientes, busqueda: query || '', mensaje }); // 👈 pasamos mensaje
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
      nombre,
      correo,
      telefono,
      direccion
    });
    res.redirect('/clientes?mensaje=Cliente actualizado exitosamente');
  } catch (err) {
    console.error("Error al actualizar cliente:", err);
    res.redirect('/clientes?mensaje=Error al actualizar cliente');
  }
});

// Eliminar cliente
router.post('/eliminar/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.redirect('/clientes?mensaje=Cliente eliminado exitosamente');
  } catch (err) {
    console.error("Error al eliminar cliente:", err);
    res.redirect('/clientes?mensaje=Error al eliminar cliente');
  }
});

module.exports = router;
