const express = require('express'); // Importamos express
const Producto = require('../models/product'); // Importamos el modelo de producto
const router = express.Router(); // Creamos un router para manejar las rutas de productos

// Obtener productos
router.get('/', async (req, res) => {
  try {
    const queryNombre = req.query.busqueda;
    const queryCategoria = req.query.categoria;

    let filtro = {};

    // Si hay búsqueda por nombre
    if (queryNombre) {
      filtro.nombre = { $regex: queryNombre, $options: 'i' };
    }

    // Si hay filtro por categoría
    if (queryCategoria && queryCategoria !== 'todas') {
      filtro.categoria = { $regex: queryCategoria, $options: 'i' };
    }

    const productos = await Producto.find(filtro);

    // Obtener lista única de categorías para el select
    const categorias = await Producto.distinct('categoria');

    res.render('productos', {
      productos,
      busqueda: queryNombre || '',
      categoriaSeleccionada: queryCategoria || 'todas',
      categorias
    });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send('Error al obtener productos');
  }
});



// Creamos un nuevo producto
router.post('/', async (req, res) => { // Ruta para crear un nuevo producto
  // Validamos que el cuerpo de la solicitud contenga los campos necesarios
  const { nombre, descripcion, precio, categoria, stock } = req.body;
  try {
    const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria, stock });
    await nuevoProducto.save();
    res.redirect('/productos'); 
  } catch (err) {
    res.status(500).send('Error al crear producto');
  }
});


// Eliminar producto por ID
router.post('/eliminar/:id', async (req, res) => { // Ruta para eliminar un producto por ID
  try { // Buscamos el producto por ID y lo eliminamos
    await Producto.findByIdAndDelete(req.params.id);
    res.redirect('/productos');
  } catch (err) { // Si ocurre un error, lo manejamos
    console.error("Error al eliminar producto:", err);
    res.status(500).send('Error al eliminar producto');
  }
});

// Mostrar formulario de edición
router.get('/editar/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    res.render('editarProducto', { producto });
  } catch (err) {
    console.error("Error al cargar el producto para editar:", err);
    res.status(500).send('Error al cargar el formulario de edición');
  }
});



// Guardar cambios del producto editado
router.post('/editar/:id', async (req, res) => {
  const { nombre, descripcion, precio, categoria, stock } = req.body;
  try {
    await Producto.findByIdAndUpdate(req.params.id, {
      nombre, descripcion, precio, categoria, stock
    });
    res.redirect('/productos');
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
    res.status(500).send('Error al actualizar el producto');
  }
});


module.exports = router;
