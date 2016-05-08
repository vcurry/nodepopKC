'use strict';

var mongoose = require('mongoose');

//Creamos el esquema
//Los tres campos son requeridos y creamos un índice en email
var pushTokenSchema = mongoose.Schema({
    plataforma: {
        type: String,
        enum: ['ios', 'android']
    },
    token: {
        type: String
    },
    usuario: {
        type: String
    }
});

//lo asignamos al modelo
var PushToken = mongoose.model('PushToken', pushTokenSchema);
