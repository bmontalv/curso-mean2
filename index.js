'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT  || 3977; //configura puerto del servidor web

//mongoose.Promise = global.Promise; // quita aviso de consola
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, ress) => {
  if (err) {
    throw err;
  } else {
    console.log('La conexion a la base de datos funciona correctamente...');

    app.listen(port, function(){
      console.log('Servidor escuchando en http://localhost:' + port)
    })
  }
});