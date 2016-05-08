'use strict';

var mongoose = require('mongoose');

var hash = require('sha.js');
var jwt = require('jsonwebtoken');
var config = require('../local_config');

/*Creamos el esquema
Los tres campos son requeridos y creamos un índice en email
*/
var usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    clave: {
        type: String,
        required: true
    }
});

usuarioSchema.statics.findUser = function(token) {
    Usuario.findOne({token: token}).exec(function(err, user) {
        if (!user.token) {
            return false;
        }
        
        return true;
    });
};

//guardamos la clave del usuario en un hash
usuarioSchema.statics.hashClave = function(clave) {
    let sha256 = hash('sha256');
    return sha256.update(clave, 'utf8').digest('hex');
};

//creamos un token que expira en dos días
usuarioSchema.statics.createToken = function(user_id) {
    let token = jwt.sign({id: user_id}, config.jwt.secret, {expiresIn: '2 days'});
    return token;
};

//lo asignamos al modelo
var Usuario = mongoose.model('Usuario', usuarioSchema);