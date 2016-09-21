'use strict'

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var knex = require('knex')['development'];

app.get('/', function (req, res) {
  res.send('booyah');
});


app.listen(PORT, function (){
  console.log('server working!');
});

module.exports = app;
