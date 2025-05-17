const mongoose = require('mongoose'); //Importamos Mongoose
const { Schema, model } = mongoose; //Importamos el esquema y el modelo de Mongoose
const bcrypt = require('bcrypt'); //Importamos bcrypt para encriptar contraseñas


const userSchema = new Schema({ //Definimos el esquema de usuario
    name: { //Definimos el esquema de nombre
        type: String,
        required: true
    },
    email: { //Definimos el esquema de email
        type: String,
        required: true
    },
    password: { //Definimos el esquema de contraseña
        type: String,
        required: true
    },
    
    role: { //Definimos el esquema de rol
        type: String,
        enum: ['admin', 'vendedor', 'comprador'], //Definimos los roles que puede tener un usuario
        default: 'comprador' //Por defecto, el rol ess comprador
    }, 

});


userSchema.pre('save', async function (next) { //Middleware que se ejecuta antes de guardar el usuario
    if (this.isModified('password')) return next(); //Si la contraseña no ha sido modificada, no se ejecuta el middleware
    const salt = await bcrypt.genSalt(10); //Generamos una sal para encriptar la contraseña
    this.password = await bcrypt.hash(this.password, salt); //Encriptamos la contraseña
    next(); //Pasamos al siguiente middleware
});

userSchema.methods.validPassword = async function (candidatePassword) { //Método para validar la contraseña
    return await bcrypt.compare(candidatePassword, this.password); //Comparamos la contraseña introducida con la contraseña encriptada
};

const User = mongoose.model('User', userSchema); //Creamos el modelo de usuario

module.exports = User; //Exportamos el modelo de usuario