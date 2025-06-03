const express = require('express'); // Importamos express
const cors = require('cors'); // Importamos cors para manejar CORS
const bodyParser = require('body-parser'); // Importamos body-parser para manejar el cuerpo de las solicitudes
const connectDB = require('./config/db'); // Importamos la función para conectar a la base de datos
require('dotenv').config(); // Cargamos las variables de entorno
const Producto = require('./models/product'); // Importamos el modelo de producto

const app = express(); // Creamos una instancia de express
connectDB(); // Conectamos a la base de datos

app.use(cors()); // Usamos cors para permitir solicitudes de diferentes dominios
app.use(bodyParser.urlencoded({ extended: true })); // Usamos body-parser para manejar el cuerpo de las solicitudes
app.use(bodyParser.json()); // Usamos body-parser para manejar el cuerpo de las solicitudes

app.set('view engine', 'ejs'); // Establecemos el motor de plantillas a EJS
app.set('views', './views'); // Establecemos la carpeta de vistas

app.use('/productos', require('./routes/productos')); // Usamos las rutas de productos
app.use('/pedidos', require('./routes/pedidos')); // Usamos las rutas de pedidos
app.use('/clientes', require('./routes/clientes')); // Usamos las rutas de clientes

app.use(express.static('public')); // Servimos archivos estáticos desde la carpeta public
app.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('index', { productos });
    } catch (err) {
        req.status(500).send('Error al cargar el producto');
    }
})

const PORT = process.env.PORT || 5000; // Establecemos el puerto del servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`)); // Iniciamos el servidor y mostramos un mensaje en la consola