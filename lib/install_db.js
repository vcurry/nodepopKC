'use strict';

require('./connectMongoose');
var mongoose = require('mongoose');
var readLine = require('readline');
var async = require('async');

//conn.once('open', function() {

function initDB() {
    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Are you sure you want to empty DB? (no) ', function(answer) {
        rl.close();
        if (answer.toLowerCase() === 'yes') {
            runInstallScript();
        } else {
            console.log('DB install aborted!');
            return process.exit(0);
        }
    });
}
 
initDB();

function runInstallScript() {
    async.series([
        initAnuncios,
        initUsuarios
    ], (err, results) => {
        if (err) {
            console.error('Hubo un error: ', err);
            return process.exit(1);
        }
        //return process.exit(0);
    }
);
}

function initAnuncios(cb) {
    var fs = require('fs');
    require('./../models/Anuncio');
    var Anuncio = mongoose.model('Anuncio');

    Anuncio.remove({}, ()=> {
        // aqui cargaríamos el json de anuncios (readFile, JSON.parse, iterar con Anuncio.save...)
        fs.readFile('anuncios.json', 'utf-8', function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            
            var datos = JSON.parse(data);
            for (var nombre in datos) {
                var anuncio = new Anuncio(datos[nombre]);
                var errors = anuncio.validateSync();
                if (errors) {
                    console.log('errors', errors);
                    return;
                }
                
                anuncio.save(function(err, saved) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
        });
    });
    cb();
}

function initUsuarios(cb) {
    require('./../models/Usuario');
    var Usuario = mongoose.model('Usuario');
    
    // elimino todos
    Usuario.remove({}, ()=> {
        
        // aqui cargaríamos al menos un usuario (Usuario.save)
        var usuario = new Usuario({
            nombre: 'veronica', 
            email: 'vcordobes@hmail.com', 
            clave: Usuario.hashClave('54321')});
        
        var errors = usuario.validateSync();
        if (errors) {
            console.log('errors', errors);
            return next(new Error('Hubo errores de validación'));
        }
        Usuario.createToken(usuario._id);
        
        usuario.save(function(err, saved) {
            
            if (err) {
                next(err);
                return;
            }
        });
    });
    cb();
};
