'use strict'
var bcrypt = require('bcrypt-nodejs');
var User =  require('../models/user');
var jwt  = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res) {
  res.status(200).send({
    message: 'Prueba del controlador de usuarios'
  });
}

function saveUser(req, res) {
  var user = new User();

  var params = req.body;

  console.log(params);

  user.name  = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role  = 'ROLE_USER';
  user.image = 'null';

  if  (params.password) {
    // Encriptar y guardar datos en BD
    bcrypt.hash(params.password, null, null, function(err, hash) {
      user.password = hash;
      if (user.name != null && user.surname != null && user.email != null) {
        // Guarda usuario
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({message: 'Error al registrar usuario'});
          }  else {
            if (!userStored) {
              res.status(404).send({message: 'No se ha registrado el usuario'});
            } else {
              res.status(200).send({user: userStored});
            }
          }
        });
      } else {
        res.status(200).send({message: 'Rellena todos los campos'});        
      }
    })
  } else {
    res.status(200).send({message: 'Introduce contraseña'});
  }

}

function loginUser(req, res) {
  var params  = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) => {
    if (err) {
      res.status(500).send({message: 'error en la peticion'});
    }  else {
      if (!user) {
        res.status(404).send({message: 'El usuario no existe'});
      } else {
        bcrypt.compare(password, user.password, function(err, check) {
          if  (check) {
            //devuelve datos del usuario logado
            if (params.gethash) {
              //devuelve token de JWT para validar usuario
              res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              res.status(200).send({user});
            }
          } else {
            res.status(404).send({message: 'El usuario no ha podido logarse'});
          }
        });
      }
    }
  });
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if(err) {
      res.status(500).send({message: 'Error al actualizar el usuario'});
    }  else {
      if (!userUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
      }  else {
        res.status(200).send({user: userUpdated});
      }
    }
  });
}

function uploadImage(req, res) {
  var userId = req.params.id;
  var file_name = 'No hay imagen';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_path_split = file_path.split('\\');
    var imageName = file_path_split[2];

    var image_split = imageName.split('\.');
    var fileExtension = image_split[1];
    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'gif') {
      User.findByIdAndUpdate(userId, {image: imageName},  (err, userUpdated) =>  {
        if (!userUpdated) {
          res.status(404).send({message: 'No se ha podido actualizar la imagen'});
        }  else {
          res.status(200).send({image: imageName, user: userUpdated});
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
  var filePath = './uploads/users/' + imageFile;
  fs.exists(filePath, function(exists) {
    if(exists) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).send({message: 'No existe la imagen'});      
    }
  });
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};