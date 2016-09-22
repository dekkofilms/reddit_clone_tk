'use strict'

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var environment = process.env.NODE_ENV;
var config = require('./knexfile.js')[environment];
var knex = require('knex')(config);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.send('booyah');
});

app.get('/users', function (req, res) {
  knex.select().table('users').then(function (data) {
    res.render('users/index', {users: data});
  });
});

app.post('/users', function (req, res) {
  var name = req.body;
  knex('users').insert(name).then(function () {
      res.redirect('/users');
    })
  });

app.get('/users/new', function (req, res) {
  res.render('users/new', {data: 'hi'});
});


app.listen(PORT, function (){
  console.log('server working!');
});

module.exports = app;
