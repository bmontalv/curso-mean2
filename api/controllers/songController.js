'use  strict'

var path = require('path');
var fs = require('fs');
//var paginate = require('mongoose-paginate');
var paginate = require('../services/paginate');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!song) {
                res.status(404).send({message: 'La canción no existe'});
            } else {
                res.status(200).send({song});
            }
        }
    })
    //Populate method change the AlbumID to the correspondig album data.
}

function getSongs(req, res) {
    var albumId = req.params.album; // Get albumID from the URL params

    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!songs) {
                res.status(404).send({message: 'No hay canciones'});
            } else {
                res.status(500).send({songs});
            }
        }
    })

    // Second populate: in the artist path, display the data of Artist model
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = params.file;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!songStored) {
                res.status(404).send({message: 'No se ha guardado la canción'});
            } else {
                res.status(200).send({song: songStored});
            }
        }
    })
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!songUpdated) {
                res.status(404).send({message: 'No se ha actualizado correctamente la canción'});
            } else {
                res.status(200).send({song: songUpdated});
            }
        }
    })
}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, sondDeleted) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!sondDeleted) {
                res.status(404).send({message: 'No se ha borrado la canción'});
            } else {
                res.status(200).send({song: sondDeleted});
            }
        }
    })
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No hay imagen';
  
    if (req.files) {
      var file_path = req.files.file.path;
      var file_path_split = file_path.split('\\');
      var fileName = file_path_split[2];
  
      var file_split = fileName.split('\.');
      var fileExtension = file_split[1];
      if (fileExtension == 'mp3' || fileExtension == 'ogg') {
        Song.findByIdAndUpdate(songId, {file: fileName},  (err, songUpdated) =>  {
          if (!songUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el fichero de canción'});
          }  else {
            res.status(200).send({song: songUpdated});
          }
        });
      } else {
        res.status(200).send({message: 'Extension de archivo no valida'});
      }
      console.log(file_path);
    } else {
      res.status(200).send({message: 'No ha subido ningun fichero de audio...'});
    }
  }
  
  function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var filePath = './uploads/songs/' + songFile;
    fs.exists(filePath, function(exists) {
      if(exists) {
        res.sendFile(path.resolve(filePath));
      } else {
        res.status(404).send({message: 'No existe el fichero de audio'});      
      }
    });
  }

module.exports = {
    getSong,
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}