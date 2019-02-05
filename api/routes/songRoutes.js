'use strict'

var express = require('express'); // para gestion de rutas
var SongController = require('../controllers/songController');
var api = express.Router(); // permite usar metodos http
var md_auth = require('../middlewares/authenticated');

//Save multimedia files
var multipart = require('connect-multiparty'); //trabajar con ficheros
var md_upload =multipart({uploadDir: './uploads/songs'});

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/songs/:id?', md_auth.ensureAuth, SongController.updateSong);
api.delete('/songs/:id?', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;