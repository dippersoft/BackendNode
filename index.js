'use strict'

var mongoose = require('mongoose');
var url= 'mongodb://localhost:27017/api_rest_blog';

mongoose.set('strictQuery', false);
mongoose.Promise= global.Promise;
mongoose.connect(url, {useNewUrlParser:true}).then(()=>{
    console.log('La a mongo correcta...');
});