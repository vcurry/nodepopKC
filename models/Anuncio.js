'use strict';

var mongoose = require('mongoose');

//Creamos el esquema de Anuncio
var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

//listamos los anuncios según los parámetros y filtros que pide el usuario
anuncioSchema.statics.list = function(filter, start, limit, sort, cb) {
    var query = Anuncio.find(filter);
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec(cb);
};

//listamos los tags disponibles
anuncioSchema.statics.listTags = function() {
    return new Promise(function(resolve, reject) {
        let tags = ['mobile', 'motor', 'lifestyle', 'work'];
        if (!tags) {
            return reject;
        } else {
            return resolve(tags);
        }
    });
};

//borramos todos lo anuncios
anuncioSchema.statics.deleteAll = function(cb) {
    Anuncio.remove({}, function(err) {
        if (err) return cb(err);
        cb(null);
    });
};

//Asignamos el esquema al modelo
var Anuncio = mongoose.model('Anuncio', anuncioSchema);
