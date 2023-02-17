'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');



var controller = {

    datosCurso: (req, res) => {

        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en frameworks',
            autor: 'Miguel',
            url: 'miguel.com',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy el test del controlador articulos'
        });
    },

    save: (req, res) => {

        //Recoger parametros por post
        var params = req.body;
        console.log(params);

        //Validar datos (con libreria validate)

        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'

            });
        }

        if (validate_title && validate_content) {
            /*return res.status(200).send({
                message:'Validacion correcta'
                
            });*/

            //Crear objeto a guardar

            var article = new Article();

            //Asignar valores

            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //Guardar el articulo

            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado!!'
                    });
                }

                //devolver respuesta

                return res.status(200).send({
                    //message:'Soy la accion del SAVE'
                    status: 'success',
                    article: articleStored
                });

            });



        } else {
            return res.status(200).send({
                message: 'Los datos no son validos'

            });
        }



    },

    getArtiles: (req, res) => {

        var last = req.params.last;
        var query = Article.find({});
        if (last || last != undefined) {

            query.limit(5);

        }

        query.sort('-id').exec((err, articles) => {

            if (err) {
                return res.status(200).send({
                    status: 'error',
                    messages: 'Error al devolver los articulos'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    messages: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });


    },

    getArticle: (req, res) => {

        //Recoger el id
        var articleId = req.params.id;
        console.log('swqwqswqwsqwsqwdsqw__  ' + articleId);

        //Comprobar que existe
        if (!articleId || articleId == null) {

            return res.status(404).send({
                error: 'error',
                message: 'No existe el articulo 1111'
            });

        }

        //Buscar el articulo
        Article.findById(articleId, (err, article) => {

            /*if(err){
                console.log(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los datos'
                });
            }*/

            if (err || !article) {
                console.log(err);
                return res.status(404).send({
                    status: 'error',
                    message: 'No existessds el articulo'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: article
            });

        });

    },

    update: (req, res) => {

        //Recoger el id del articulo

        var articleId = req.params.id;

        //Recoger los datos que llegan por put

        var params = req.body;

        //Validar los datos

        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {

            // Find and update

            Article.findByIdAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });

        }






    },

    delete: (req, res) => {

        //Recoger el Id por url
        var articleId = req.params.id;

        //Find and delete

        Article.findByIdAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El articulo no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        });

    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        //Recoger el fichero de la peticion

        var file_name = 'imaen no subida';

        console.log('El archivo ' + req.files);
        console.log(req.files);


        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        //var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });

        } else {
            // Si todo es valido, sacando id de la url
            var articleId = req.params.id;

            if (articleId) {
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {

                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success 11',
                        article: articleUpdated
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }

        }
    },//End de upload file

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        if (fs.existsSync(path_file)) {
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe !!!'
            });
        }

        /*fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });*/
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición !!!'
                    });
                }

                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });

            });
    }

};

module.exports = controller;