const express = require("express");     //Importamos Express
const app = express();                  //Creamos una instancia de la app

app.use("/", (req, res) => {            //Definímos una ruta raíz "/"
    res.send("Server is running");      //Devuelve un mensaje simple
});

app.listen(8080, () => {                //El servidor escucha en el puerto 8080
    console.log("Server is running on port 8080");
});
