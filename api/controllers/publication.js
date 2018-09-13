'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res) {
    return res.status(200).send({ message: 'desde publicaciones' })
}

function savePublication(req, res) {
    var params = req.body;
    var publication = new Publication();
    if (!params.text) return res.status(200).send({ message: 'Tienes que mandar un texto' });

    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if (err) res.status(500).send({ message: "Error al guardar la publicacion" });
        if (!publicationStored) res.status(404).send({ message: "La publicacion no ha sido realizada" });

        return res.status(200).send({ publication: publicationStored });
    });
}

function getPublications(req, res) {
    var page = 1;
    var itemsPerPage = 4;
    if (req.params.page) {
        page = req.params.page;
    }

    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) res.status(500).send({ message: "Error al obtener el seguimiento" });
        if (!follows) res.status(404).send({ message: "No se encontraron usuario seguidos" });

        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });

        Publication.find({ user: { $in: follows_clean } }).sort('-created_at')
            .populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
                if (err) res.status(500).send({ message: "Error al obtener publicaciones" });
                if (!follows) res.status(404).send({ message: "No se encontraron publicaciones" });

                return res.status(200).send({
                    total_items: total,
                    pages: Math.ceil(total / itemsPerPage),
                    page: page,
                    publications
                })

            })
    })
}

function getPublication(req, res) {
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if (err) res.status(500).send({ message: "Error al obtener publicacion" });
        if (!publication) res.status(404).send({ message: "No se encontro publicacion" });

        return res.status(200).send({ publication });
    })
}

function deletePublication(req, res) {
    var publicationId = req.params.id;

    Publication.find({ user: req.user.sub, '_id': publicationId }).remove((err) => {
        if (err) res.status(500).send({ message: "Error al borrar publicacion" });
        // if (!publicationRemoved) res.status(404).send({ message: "No se elimino la publicacion" });
        return res.status(200).send({ message: "eliminada correctamente" });
    })
}

function uploadImage(req, res) {
    var publicationId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var filename = file_split[2];
        var ext_split = filename.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            Publication.findOne({ user: req.user.sub, '_id': publicationId }).exec((err, publication) => {
                if (publication) {
                    return Publication.findByIdAndUpdate(publicationId, { file: filename }, { new: true }, (err, publicationUpdated) => {
                        if (err) return res.status(500).send({ message: 'error en la peticion' });
                        if (!publicationUpdated) return res.status(404).send({ message: 'No se ha actualizado la imagen' });

                        return res.status(200).send({ publication: publicationUpdated });
                    });
                } else {
                    return res.status(404).send({ message: 'No tienes permiso de modificar esta publicacion' });
                }
            })


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
    var pathFile = './uploads/publications/' + imagefile;

    fs.exists(pathFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(pathFile));
        } else {
            return res.status(200).send({ message: 'No existe la imagen' });
        }
    })
}


module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}