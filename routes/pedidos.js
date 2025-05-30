const express = require('express'); // Importamos express
const Pedido = require('../models/pedido'); // Importamos el modelo Pedido
const Product = require('../models/product'); // Importamos el modelo Product
const Cliente = require('../models/cliente'); // Importamos el modelo Cliente
const router = express.Router(); // Creamos un router para manejar las rutas de pedidos

//Muestra formulario para crear un nuevo pedido
router.get('/editar/:id', async (req, res) => {
  const pedido = await Pedido.findById(req.params.id);
  res.render('editarPedido', { pedido });
});

// Actualiza un pedido existente
router.post('/editar/:id', async (req, res) => {
  const { estado } = req.body;
  await Pedido.findByIdAndUpdate(req.params.id, { estado });
  res.redirect('/pedidos');
});


// Muestra todos los pedidos y permite crear uno nuevo
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

// Crear un nuevo pedido con múltiples productos
router.post('/', async (req, res) => {
  try {
    const clienteDB = await Cliente.findById(req.body.cliente_id);
    const productosSeleccionados = req.body.producto_id;

    const todosProductos = await Product.find();

    let total = 0;
    const listaProductos = [];

    // Si solo hay un producto seleccionado, convertirlo a array
    const productosArray = Array.isArray(productosSeleccionados) ? productosSeleccionados : [productosSeleccionados];

    for (let id of productosArray) {
      const prod = todosProductos.find(p => p._id.toString() === id);
      const cantidad = parseInt(req.body[`cantidad_${id}`], 10);

      if (prod && cantidad > 0) {
        listaProductos.push({
          id_producto: prod._id,
          nombre: prod.nombre,
          precio_unitario: prod.precio,
          cantidad
        });

        total += prod.precio * cantidad;

        // Actualizar stock
        await Product.updateOne(
          { _id: prod._id },
          { $inc: { stock: -cantidad } }
        );
      }
    }

    const pedido = new Pedido({
      cliente: {
        id: clienteDB._id,
        nombre: clienteDB.nombre,
        correo: clienteDB.correo
      },
      productos: listaProductos,
      total,
      estado: 'pendiente',
      fecha: new Date()
    });

    await pedido.save();
    res.redirect('/pedidos');

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar pedido");
  }
});

// Elimina un pedido por su ID
router.post('/eliminar/:id', async (req, res) => {
  await Pedido.findByIdAndDelete(req.params.id);
  res.redirect('/pedidos');
});


module.exports = router;