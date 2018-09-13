'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'este_es_mi_token';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        nickname: user.nickname,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret);
}