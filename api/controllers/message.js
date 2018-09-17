'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Message = require('../models/message');
var User = require('../models/user')
var Follow = require('../models/follow');

function probando(req, res) {
    return res.status(200).send({ message: 'Este es mi mensajeria' });
}

function saveMessage(req, res) {
    var params = req.body;

    if (!params.text || !params.receiver) {
        return res.status(200).send({ message: 'Envia los datos completos' });
    }

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar el mensaje' });
        if (!messageStored) return res.status(404).send({ message: 'No se guardo el mensaje' });

        return res.status(200).send({ message: messageStored });
    })
}

function getReceivedMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    var itemsPerPage = 4;

    if (req.params.page) {
        page = req.params.page;
    }

    Message.find({ receiver: userId }).populate('emitter', 'name lastname _id nickname image').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'Error al obtener mensages' });
        if (!messages) return res.status(404).send({ message: 'No se encontraron mensajes' });

        return res.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    })
}


function getEmittedMessages(req, res) {
    var userId = req.user.sub;
    var page = 1;
    var itemsPerPage = 4;

    if (req.params.page) {
        page = req.params.page;
    }

    Message.find({ emitter: userId }).populate('emitter receiver', 'name lastname _id nickname image').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'Error al obtener mensages' });
        if (!messages) return res.status(404).send({ message: 'No se encontraron mensajes' });

        return res.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    })
}


function getUnviewedMessages(req, res) {
    var userId = req.user.sub;

    Message.count({ receiver: userId, viewed: 'false' }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'Error al obtener mensages' });
        return res.status(200).send({ unviewed: count });
    })
}

function setViewedMessages(req, res) {
    var userId = req.user.sub;

    Message.update({ receiver: userId, viewed: 'false' }, { viewed: 'true' }, { multi: 'true' }, (err, messagesUpdate) => {
        if (err) return res.status(500).send({ message: 'Error al actualizar mensages' });
        return res.status(200).send({ messagesUpdate });
    })
}



module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnviewedMessages,
    setViewedMessages
}