const express = require('express'); // Importamos express
const cors = require('cors'); // Importamos cors para manejar CORS
const bodyParser = require('body-parser'); // Importamos body-parser para manejar el cuerpo de las solicitudes
const connectDB = require('./config/db'); // Importamos la función para conectar a la base de datos
require('dotenv').config(); // Cargamos las variables de entorno

const app = express(); // Creamos una instancia de express
connectDB(); // Conectamos a la base de datos

app.use(cors()); // Usamos cors para permitir solicitudes de diferentes dominios
app.use(bodyParser.urlencoded({ extended: true })); // Usamos body-parser para manejar el cuerpo de las solicitudes
app.use(bodyParser.json()); // Usamos body-parser para manejar el cuerpo de las solicitudes

app.set('view engine', 'ejs'); // Establecemos el motor de plantillas a EJS
app.set('views', './views'); // Establecemos la carpeta de vistas

app.use('/productos', require('./routes/productos')); // Usamos las rutas de productos
app.use('/pedidos', require('./routes/pedidos')); // Usamos las rutas de pedidos

const PORT = process.env.PORT || 5000; // Establecemos el puerto del servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`)); // Iniciamos el servidor y mostramos un mensaje en la consola