'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePagination = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

function home(req, res) {
    res.status(200).send({
        message: "este es mi index"
    });
}

function pruebas(req, res) {
    res.status(200).send({
        message: "estas son mis pruebas"
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    if (params.name && params.lastname && params.nickname && params.email && params.password) {
        user.name = params.name;
        user.lastname = params.lastname;
        user.nickname = params.nickname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = 'null';

        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nickname: user.nickname.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) {
                return res.status(500).send({ message: 'Error al guardar' });
            }

            if (users && users.length > 0) {
                return res.status(200).send({ message: "el usuario existe" });
            }
        });


        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;

            user.save((err, userStored) => {
                if (err) {
                    return res.status(500).send({ message: 'Error al guardar' });
                }

                if (userStored) {
                    res.status(200).send({ user: userStored });
                } else {
                    res.status(404).send({ message: 'no se ha registrado el usuario' });

                }
            });

        });
    } else {
        res.status(200).send({
            message: 'Datos incompletos'
        })
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({
        email: email
    }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error al iniciar sesion ' });

        if (user) {
            bcrypt.compare(password, user.password, (err, isLogin) => {
                if (err) return res.status(500).send({ message: 'Error al iniciar session' });
                if (isLogin) {

                    if (params.getToken && params.getToken == 'true') {
                        return res.status(200).send({ token: jwt.createToken(user) })
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user: user });
                    }

                } else {
                    return res.status(404).send({ message: 'No se ha iniciado sesion' });
                }
            })
        } else {
            return res.status(404).send({ message: 'El usuario no existe' });
        }
    })

}

function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: "Error en peticion" });

        if (!user) return res.status(404).send({ message: 'El usuario no existe' });

        return res.status(200).send({ user });
    })
}

function getUsers(req, res) {
    var identity_user_id = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en peticion' });

        if (!users) return res.status(404).send({ message: 'no hay usuario disponibles' });

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function updateUser(req, res) {
    var idUser = req.params.id;
    var params = req.body;

    delete params.password;

    if (idUser != req.user.sub) {
        return res.status(500).send({ message: 'No puedes modificar datos del usuario' });
    }

    User.findByIdAndUpdate(idUser, params, { new: true }, (err, userUpdated) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!userUpdated) return res.status(404).send({ message: 'No se ha actualizado el usuario' });

        return res.status(200).send({ user: userUpdated });
    });

}

function uploadImage(req, res) {
    var userId = req.params.id;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar' });
    }

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var filename = file_split[2];
        var ext_split = filename.split('\.');
        var file_ext = ext_split[1];

        User

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            return User.findByIdAndUpdate(userId, { image: filename }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'error en la peticion' });
                if (!userUpdated) return res.status(404).send({ message: 'No se ha actualizado la imagen' });

                return res.status(200).send({ user: userUpdated });
            });
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se ha subido archivos' });
    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message });
    });
}


function getImageFile(req, res) {
    var imagefile = req.params.imageFile;
    var pathFile = './uploads/users/' + imagefile;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(200).send({ message: 'No existe la imagen' });
        }
    })
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
};