'use strict'

var express = require('express'); // para gestion de rutas
var ArtistController = require('../controllers/artistController');
var api = express.Router(); // permite usar metodos http
var md_auth = require('../middlewares/authenticated');

//Save multimedia files
var multipart = require('connect-multiparty'); //trabajar con ficheros
var md_upload =multipart({uploadDir: './uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);



module.exports = api;