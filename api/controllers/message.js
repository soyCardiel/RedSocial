'use strict'

var momment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Message = require('../models/message');
var User = require('../models/user')
var Follow = require('../models/follow');

function probando(req, res) {
    return res.status(200).send({ message: 'Este es mi mensajeria' });
}

module.exports = {
    probando
}