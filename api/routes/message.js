'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
// var FollowcController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probandomessage', MessageController.probando);


module.exports = api;