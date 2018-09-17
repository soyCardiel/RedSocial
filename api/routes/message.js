'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
// var FollowcController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probandomessage', MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/mymessages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/unviewedmessages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/setviewedmessages', md_auth.ensureAuth, MessageController.setViewedMessages);


module.exports = api;