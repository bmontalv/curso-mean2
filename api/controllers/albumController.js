'use  strict'

var path = require('path');
var fs = require('fs');
//var paginate = require('mongoose-paginate');
var paginate = require('../services/paginate');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

Artist.paginate = paginate;
console.log(typeof Artist.paginate);
console.log(Artist.paginate);

function getAlbum(req, res) {
    var albumId = req.params.id;

    // findById is included in mongoose (into model/album)
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({message: 'Error en la peticion de album'});
        } else {
            if (!album) {
                res.status(404).send({message: 'Album no existe'});
            } else {
                res.status(200).send({album});
            }
        }
    }); // get all data artist data in Album
}

function getAlbums(req, res) {
    var artistId = req.param.artist;

    if (!artistId) {
        // Sacar todos los albums de la DB
        var find = Album.find({}).sort('title');
    } else {
        // Sacar albums de un artista concreto de la BD
        var finde = ALbum.find({artist: artistId}).sort('year');
    }
    find.populate({path: 'artist'}).exec((err, albums) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!albums) {
                res.status(400).send({message: 'No hay albums'});
            } else {
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save ((err, albumStored) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!albumStored) {
                res.status(404).send({message: 'Error al guardar album'});
            } else {
                res.status(200).send({album: albumStored});
            }
        }
    })
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!albumUpdated) {
                res.status(404).send({message: 'No existe el album'});
            } else {
                res.status(200).send({album: albumUpdated});
            }
        }
    })
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    //Delete all data related to this artist
    Album.findByIdAndRemove(albumId, (err, albumRemoved)=> {
        if (err) {
          res.status(500).send({message: "Error al borrar album de artista"});
        } else {
          if (!albumRemoved) {
            res.status(404).send({message: "Album de artista no eliminado"});
          } else {
            //res.status(200).send({albumRemoved});

            // Delete all songs related to the album
            Song.find({album: albumRemoved._id}).remove((err, songRemoved)=> {
              if (err) {
                res.status(500).send({message: "Error al borrar cancion de album"});
              } else {
                if (!songRemoved) {
                  res.status(404).send({message: "Cancion de album  no eliminada"});
                } else {
                  res.status(200).send({album: albumRemoved});
                }
              }
            });
          }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No hay imagen';
  
    if (req.files) {
      var file_path = req.files.image.path;
      var file_path_split = file_path.split('\\');
      var imageName = file_path_split[2];
  
      var image_split = imageName.split('\.');
      var fileExtension = image_split[1];
      if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'gif') {
        Album.findByIdAndUpdate(albumId, {image: imageName},  (err, albumUpdated) =>  {
          if (!albumUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar la imagen del album'});
          }  else {
            res.status(200).send({album: albumUpdated});
          }
        });
      } else {
        res.status(200).send({message: 'Extension de archivo no valida'});
      }
      console.log(file_path);
    } else {
      res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
  }
  
  function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var filePath = './uploads/albums/' + imageFile;
    fs.exists(filePath, function(exists) {
      if(exists) {
        res.sendFile(path.resolve(filePath));
      } else {
        res.status(404).send({message: 'No existe la imagen'});      
      }
    });
  }

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}