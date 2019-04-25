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

function getArtist(req, res) {
  console.log(req.params)
  var artistId = req.params.id;
  console.log(artistId);

  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(500).send({message: 'Error en la peticion'}); 
    } else {
      if (!artist) {
        res.status(404).send({message: 'Artista no existe'});
      } else {
        res.status(200).send({artist});
      }
    }
  });
}

function saveArtist(req, res) {
  var artist = new Artist();
  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({message: 'Error al guardar artista'});
    }  else {
      if (!artistStored) {
        res.status(404).send({message: 'Artista no guardado'});
      } else {
        res.status(200).send({artist: artistStored});
      }
    }
  });
}

function getArtists(req, res) {
  if (req.params.page) {
    var page = parseInt(req.params.page);
    console.log("items per page=" + page);
  } else {
    var  page = 1
  }
  var itemsPerPage = 4; // 4 artistas por pagina

  Artist = Artist.find().sort('name');

  Artist.model.paginate({}, page, itemsPerPage, function(err, artists, totalItems) {
  //paginate({}, itemsPerPage, page, function(err, artists, totalItems) {
    if (err) {
      console.log(err);
      res.status(500).send({message: 'Error en la peticion'});      
    } else {
      if (!artists) {
        res.status(404).send({message: 'No hay artistas'});        
      } else {
        return res.status(200).send({
          artists: artists,
          total: totalItems
        });        
      }
    }
  }, {sortBy: 'name'});
};

function updateArtist(req, res) {
  var artistId= req.params.id;
  var updateData = req.body;

  Artist.findByIdAndUpdate(artistId, updateData, (err, artistUpdated) => {
    if (err) {
      res.status(500).send({message: "Error al guardar el artista"});
    } else if (!artistUpdated) {
      res.status(404).send({message: "Artista no ha sido actualizado"});
    } else {
      res.status(200).send({artist: artistUpdated});
    }
  });
}

function deleteArtist(req, res) {
  var artistId = req.params.id;
  
  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({message: "Error al borrar artista"});
    } else {
      if (!artistRemoved) {
        res.status(404).send({message: "Artista no eliminado"});
      } else {
        console.log(artistRemoved);

        //Delete all data related to this artist
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=> {
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
                    res.status(200).send({artist: artistRemoved});
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}

function uploadImage(req, res) {
  var artistId = req.params.id;
  var file_name = 'No hay imagen';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_path_split = file_path.split('\\');
    var imageName = file_path_split[2];

    var image_split = imageName.split('\.');
    var fileExtension = image_split[1];
    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'gif') {
      Artist.findByIdAndUpdate(artistId, {image: imageName},  (err, artistUpdated) =>  {
        if (!artistUpdated) {
          res.status(404).send({message: 'No se ha podido actualizar la imagen'});
        }  else {
          res.status(200).send({artist: artistUpdated});
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
  var filePath = './uploads/artists/' + imageFile;
  fs.exists(filePath, function(exists) {
    if(exists) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).send({message: 'No existe la imagen'});      
    }
  });
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};