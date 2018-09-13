'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//creamos los middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');

//router
app.use('/api', user_routes);
app.use('/api', follow_routes);

//exportar el archivo
module.exports = app;