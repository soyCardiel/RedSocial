'use strict'

// var path = require('path');
// var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res) {
    res.status(200).send({ message: 'este es mi follow' });
}

function saveFollow(req, res) {
    var params = req.body;
    var follow = new Follow();

    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'Follow no realizado' });
        if (!followStored) return res.status(404).send({ message: 'follow no guardado' });

        return res.status(200).send({ follow: followStored });
    });
}

function deletefollow(req, res) {
    var userid = req.user.sub;
    var followId = req.params.id;

    Follow.find({ user: userid, followed: followId }).remove((err) => {
        if (err) return res.status(500).send({ message: 'Follow no realizado' });
        return res.status(200).send({ message: 'follow eliminado' });
    })
}

function getFollowedUser(req, res) {
    var userId = req.user.sub;
    var page = 1;
    var itemsPerPage = 4;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {

        if (err) return res.status(500).send({ message: 'No se obtuvieron los datos' });
        if (!follows) return res.status(404).send({ message: 'No hay usuarios seguidos' });

        return res.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });
    });

}

function getFollowingUsers(req, res) {
    var userId = req.user.sub;
    var page = 1;
    var itemsPerPage = 4;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {

        if (err) return res.status(500).send({ message: 'No se obtuvieron los datos' });
        if (!follows) return res.status(404).send({ message: 'No te sigue ningun usuario' });

        return res.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),
            follows
        });
    });
}

function getMyFollows(req, res) {
    var userId = req.user.sub;
    var followed = req.params.followed;

    var find = Follow.find({ user: userId });
    if (followed) {
        find = Follow.find({ followed: userId });
    }

    find.populate({ path: 'user followed' }).exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'No se obtuvieron los datos' });
        if (!follows) return res.status(404).send({ message: 'No hay usuarios seguidos' });

        return res.status(200).send({ follows });
    });
}

module.exports = {
    prueba,
    saveFollow,
    deletefollow,
    getFollowedUser,
    getFollowingUsers,
    getMyFollows
};