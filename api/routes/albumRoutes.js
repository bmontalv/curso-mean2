'use strict'

var express = require('express'); // para gestion de rutas
var AlbumController = require('../controllers/albumController');
var api = express.Router(); // permite usar metodos http
var md_auth = require('../middlewares/authenticated');

//Save multimedia files
var multipart = require('connect-multiparty'); //trabajar con ficheros
var md_upload =multipart({uploadDir: './uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);

api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;