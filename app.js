'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var userRoutes = require('./routes/userRoutes');
var artistRoutes = require('./routes/artistRoutes');
var albumRoutes = require('./routes/albumRoutes');
var songRoutes = require('./routes/songRoutes');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // convierte a JSON las respuestas de peticiones

//configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Controll-Allow-Request-Method');
    res.header('Access-Controll-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next(); //Exit from this middleware, continue with the flow.
});

//rutas base
app.use('/api', userRoutes); //introduce delante de la ruta el /api
app.use('/api', artistRoutes);
app.use('/api', albumRoutes);
app.use('/api', songRoutes);

// prueba inicial para gestionar una ruta
// app.get('/pruebas', function(req, res) {
//   res.status(200).send({message: 'Pagina de prueba del API'});
// });

module.exports = app;