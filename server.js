const express = require('express'); // Importamos express
const cors = require('cors'); // Importamos cors para manejar CORS
const bodyParser = require('body-parser'); // Importamos body-parser para manejar el cuerpo de las solicitudes
const connectDB = require('./config/db'); // Importamos la función para conectar a la base de datos
const productos = require('./routes/productos'); // Importamos las rutas de productos
require('dotenv').config(); // Cargamos las variables de entorno

const app = express(); // Creamos una instancia de express
connectDB(); // Conectamos a la base de datos

app.use(cors()); // Usamos cors para permitir solicitudes de diferentes dominios
app.use(bodyParser.json()); // Usamos body-parser para manejar el cuerpo de las solicitudes
app.use('/api/productos', productos); // Usamos las rutas de productos

const PORT = process.env.PORT || 5000; // Definimos el puerto en el que escuchará el servidor
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`)); // Iniciamos el servidor y mostramos un mensaje en la consola
