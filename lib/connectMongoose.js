'use strict';

var mongoose = require('mongoose');
var conn = mongoose.connection;

//handlers de eventos de conexión
conn.on('error', function(err) {
    console.log('connection error!');
    process.exit(1);
});

conn.once('open', function() {
    console.log('Connected to mongodb!');
});

//conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/nodepop');
