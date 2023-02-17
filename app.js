'use strict'

// cargar modulos 
var express= require('express');
var bodyParser= require('body-parser');

//Ejecutar express (http)
var app=express();

//Cargar ficheros de rutas

var article_routes=require('./routes/article');

//Midleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a las rutas /Cargar Rutas

app.use('/api',article_routes);

//Ruta o metodo de prueba para el API REST



/*app.post('/datos-curso', (req, res)=>{

    console.log('Hola Mundo');
    /*return res.status(200).send(`
    <ul>
        <li>Node</li>
    </ul>
    `);*/


  /*  var hola=req.body.hola;

    return res.status(200).send({
        curso:'Master en frameworks',
        autor: 'Miguel',
        url: 'miguel.com',
        hola
    });
}  );
*/
//Exportar modulo
module.exports =app;