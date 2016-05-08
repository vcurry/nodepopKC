'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

//Cargamos el modelo de anuncio
var Anuncio = mongoose.model('Anuncio');
var Usuario = mongoose.model('Usuario');

router.get('/', function (req, res) {
    var nombre = req.query.nombre;
    var venta = req.query.venta;
    var precio = req.query.precio;
    var tag = req.query.tag;
    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || null;
    var sort = req.query.sort || null;
    var includeTotal = req.query.includeTotal || false;
    var token = req.query.token;
    var criteria = {};
    
    let i18n = new (require('i18n-2'))({
        locales: [req.query.lang]
    });

    if (!token) {
        return res.json({success: false, error: i18n.__('No token provided')});
        
    } else {
        //criterio tags
        if (typeof tag !== 'undefined') {
            criteria.tags = tag;
        }

        //criterio venta: true/false
        if (venta === 'true') {
            criteria.venta = true;
        } else if (venta === 'false') {
            criteria.venta = false;
        }

        //criterio precio: rangos 10 a 50
        if (precio === '10-50') {
            criteria.precio = ({$gte: 10, $lte: 50});
        } else if (precio === '10-') {
            criteria.precio = ({$gte: 10});
        } else if (precio === '-50') {
            criteria.precio = ({$lte: 50});
        } else if (precio === '50') {
            criteria.precio = 50.00;
        }

        //criterio nombre
        if (nombre !== undefined) {
            criteria.nombre = new RegExp('^' + nombre, "i");
        }

        Anuncio.list(criteria, start, limit, sort, function (err, rows) {
            if (err) {
                return res.json({success: false, error: err});
            }

            //añadimos en la respuesta el total de anuncios de la query
            if (includeTotal === 'true') {
                return res.json({success: true, rows: rows, "total": rows.length});
            } else {
                return res.json({success: true, rows: rows});
            }
        });
    }
});

//listamos los tags disponibles en el API
router.get('/tags', function(req, res) {
    Anuncio.listTags().then(function(data) {
        res.json({tags: data});
    }).catch(function(err) {
        res.json({tags: err});
    });
});

module.exports = router;
