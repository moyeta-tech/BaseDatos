const express = require('express'); // Importamos express
const Producto = require('../models/product'); // Importamos el modelo de producto
const router = express.Router(); // Creamos un router para manejar las rutas de productos
const multer = require('multer'); // Importamos multer para manejar la subida de archivos
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Obtener productos
router.get('/', async (req, res) => {
  try {
    const queryNombre = req.query.busqueda;
    const queryCategoria = req.query.categoria;
    const mensaje = req.query.mensaje; // agregamos esto

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
      categorias,
      mensaje // 👈 pasamos mensaje a la vista
    });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).send('Error al obtener productos');
  }
});

// Crear un nuevo producto
router.post('/', upload.single('image'), async (req, res) => {
  const { nombre, descripcion, precio, categoria, stock } = req.body;
  const imagen = req.file ? '/uploads/' + req.file.filename : null;
  try {
    // Verificar si ya existe un producto con el mismo nombre
    const productoExistente = await Producto.findOne({ nombre });

    if (productoExistente) {
      return res.redirect('/productos?mensaje=Error: Ya existe un producto con ese nombre');
    }

    const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria, stock, imagen });
    await nuevoProducto.save();
    res.redirect('/productos?mensaje=Producto creado exitosamente');
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.redirect('/productos?mensaje=Error al crear producto');
  }
});


// Eliminar producto por ID
router.post('/eliminar/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.redirect('/productos?mensaje=Producto eliminado exitosamente');
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.redirect('/productos?mensaje=Error al eliminar producto');
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
router.post('/editar/:id', upload.single('image') ,async (req, res) => {
  const { nombre, descripcion, precio, categoria, stock } = req.body;
  let updateFields = { nombre, descripcion, precio, categoria, stock };
  if (req.file) {
    updateFields.imagen = '/uploads/' + req.file.filename; // Actualizar imagen si se subió una nueva
  }
  try {
    await Producto.findByIdAndUpdate(req.params.id, {
      nombre, descripcion, precio, categoria, stock
    });
    res.redirect('/productos?mensaje=Producto actualizado exitosamente');
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
    res.redirect('/productos?mensaje=Error al actualizar producto');
  }
});

module.exports = router;
