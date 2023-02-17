'use strict'

var mongoose = require('mongoose');
var url= 'mongodb://localhost:27017/api_rest_blog';
var app=require('./app');
var port= 3900;

mongoose.set('strictQuery', false);
mongoose.Promise= global.Promise;
mongoose.connect(url, {useNewUrlParser:true}).then(()=>{
    console.log('La a mongo correcta...');

    //Crear servidor escuchar peticiones

    app.listen(port, ()=>{
        console.log('Servidor corriendo en http://localhost:3900');
    } );
});