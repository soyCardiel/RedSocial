'use strict'

var express = require('express');
var FollowcController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/pruebas', md_auth.ensureAuth, FollowcController.prueba);
api.post('/follow', md_auth.ensureAuth, FollowcController.saveFollow);
api.delete('/unfollow/:id', md_auth.ensureAuth, FollowcController.deletefollow);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowcController.getFollowedUser);
api.get('/following/:id?/:page?', md_auth.ensureAuth, FollowcController.getFollowingUsers);
api.get('/getmyfollows/:followed?', md_auth.ensureAuth, FollowcController.getMyFollows);

module.exports = api;