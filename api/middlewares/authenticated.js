'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'este_es_mi_token';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'no existe token' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    var payload;
    try {
        payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'token expirado' });
        }
    } catch (ex) {
        return res.status(404).send({ message: 'token no valido' });
    }

    req.user = payload;

    next();

}