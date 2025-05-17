const express = require("express");     //Importamos Express
const app = express();                  //Creamos una instancia de la app
const path = require("path");            //Importamos el módulo path
const mongoose = require("mongoose");  //Importamos Mongoose

const User = require("./models/User"); //Importamos el modelo de usuario

app.set("view engine", "ejs");           //Configuramos el motor de plantillas EJS
app.set("views", path.join(__dirname, "views")); //Configuramos la carpeta de vistas

main().then(() => {
    console.log("Conectado a la base de datos")
}).catch(err => console.log(err)); //Conectamos a la base de datos

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/BaseDatos") //Conectamos a la base de datos
}


app.get("/", async (req, res) => { //Definimos la ruta raíz
    let user= new User({ //Creamos un nuevo usuario
        name: "Ana Gomez", //Nombre del usuario
        email: "anitgomezok@gmail.com", //Email del usuario
        password: "123456", //Contraseña del usuario
        role: "admin" //Rol del usuario
    });

    let admin = await user.save(); //Guardamos el usuario en la base de datos
    res.send(admin) //Enviamos el usuario como respuesta

})

app.listen(8080, () => {                //El servidor escucha en el puerto 8080
    console.log("Server is running on port 8080");
});
