'use strict';

var express = require ('express');
var router = express.Router();

let Usuario = require('mongoose').model('Usuario');
let Token = require('mongoose').model('PushToken');

//registramos al usuario, guardamos la clave en un hash y devolvemos un token
router.post('/register', function(req, res, next) {
    let i18n = new (require('i18n-2'))({
        locales: [req.query.lang]
    });
    let user = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        clave : Usuario.hashClave(req.body.clave)});

    let errors = user.validateSync();
    if(errors){
        console.log(i18n.__('ValidationError'));
        next(new Error(i18n.__('ValidationError')));
        return;
    }
    user.save(function(err, saved) {
        if (err){
            next(err);
            return;
        }
    });

    res.json({success: true, token: Usuario.createToken(user._id)});
});

//verificamos si el email y la clave autentican al usuario
router.post('/authenticate', function(req, res) {
    let i18n = new (require('i18n-2'))({
        locales: [req.query.lang]
    });
    let email = req.body.email;
    let clave = Usuario.hashClave(req.body.clave);

    Usuario.findOne({email: email}).exec(function(err, user) {
        if (err){
            return res.status(500).json({success: false, error: err});
        }
        if(!user.email){
            return res.status(401).json({success: false, error: (i18n.__('auth failed. User not found'))});
        }
        if(user.clave !== clave){
            return res.status(401).json({success: false, error: (i18n.__('auth failed. Invalid password'))});
        }
        res.json({success: true, email: "autenticado"});
    });
});

//guardamos el token con la plataforma
router.put('/pushtoken', function(req, res) {
    let i18n = new (require('i18n-2'))({
        locales: [req.query.lang]
    });

    let token = new Token(req.body);
    let errors = token.validateSync();

    if (errors) {
        console.log('errors', errors);
        next(new Error(i18n.__('Token validation error')));
        return;
    }
    token.save(function(err, saved) {
        if (err) {
            next(err);
            return;
        }
        res.json({success: true, saved: saved});
    });
});

module.exports = router;