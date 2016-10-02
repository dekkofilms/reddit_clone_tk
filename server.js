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
// app.use(express.static('public'));

app.get('/', function (req, res) {
  res.redirect('/users');
});

app.get('/posts', function (req, res) {
  var url = req.url.split('=');
  var userID = url.pop();
  knex.select().table('posts').then(function (data) {
    res.render('posts/index', {posts: data, userID: userID});
  })
});

app.post('/posts/new', function (req, res) {
  var post = req.body;
  console.log(post);
  knex('posts').insert(post).then(function () {
    res.redirect('/posts?user=' + post.user_id);
  })
});

app.get('/posts/:postID', function (req, res) {
  var postID = req.params.postID;
  var url = req.url
  knex('posts').where({id: postID}).first().then(function (post) {
    knex('comments').where({post_id: postID}).then(function (comment) {
      res.render('posts/id', {post: post, url: url, comment: comment});
    })
  });
});

app.post('/posts/:postID', function (req, res) {
  var postID = req.params.postID;
  var comment = req.body;
  var url = req.url.split('=');
  var userID = url.pop();
  knex('comments').insert({comment_content: comment.comment_content, post_id: postID, user_id: userID}).then(function () {
    res.redirect(req.url);
  });
});


app.get('/users', function (req, res) {
  knex.select().table('users').then(function (data) {
    console.log(data);
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

app.get('/users/:userID', function (req, res) {
  var userID = req.params.userID
  var url = req.url
  knex.table('users').where({id: userID}).first().then(function (data) {
    console.log(data);
    res.render('users/id', {user: data, url: url, userID: userID});
  });
});

app.listen(PORT, function (){
  console.log('server is running!');
});

module.exports = app;
