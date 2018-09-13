'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/redsocial', { useNewUrlParser: true }).then(() => {
    console.log('is connected');

    //crear servidor
    app.listen(port, () => {
        console.log("Ejecutando servidor en puerto " + port);
    });
}).catch(err => console.log(err));