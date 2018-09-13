'use strict'

var Express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');

var api = Express.Router();
var md_upload = multipart({ uploadDir: './uploads/users' });

// console.log(UserController);

api.get('/', UserController.home);
api.get('/home', UserController.home);
api.get('/prueba', md_auth.ensureAuth, UserController.pruebas);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/updateuser/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/uploaduserimage/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/getuserimage/:imageFile', UserController.getImageFile);
api.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);

module.exports = api;