'use strict'

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var environment = process.env.NODE_ENV;
var config = require('./knexfile.js')[environment];
var knex = require('knex')(config);
var methodOverride = require('method-override');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

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

app.get('/posts/edit', function (req, res) {
  var url = req.url.split('=');
  var postID = url.pop();
  knex('posts').where({id: postID}).first().then(function (data) {
    res.render('posts/edit', {post: data})
  })
});

app.put('/posts/edit', function (req, res) {
  var update = req.body;
  console.log(update);
  knex('posts').where({id: update.id}).update({title: update.title, post_link: update.post_link, post_content: update.post_content}).then(function () {
    res.redirect('/users/' + update.userID)
  })
});

app.post('/posts/new', function (req, res) {
  var post = req.body;
  knex('posts').insert(post).then(function () {
    res.redirect('/posts?user=' + post.user_id);
  })
});

app.delete('/posts', function (req, res) {
  var del = req.body;
  console.log(del);
  knex.select().table('posts').where({id: del.id}).del().then(function () {
    res.redirect('/users/' + del.userID);
  })
});

app.get('/posts/:postID', function (req, res) {
  var postID = req.params.postID;
  var url = req.url;

  var user = req.url.split('=');
  var userID = user.pop();
  knex('posts').where({id: postID}).first().then(function (post) {
    knex('comments').where({post_id: postID}).then(function (comment) {
      res.render('posts/id', {post: post, url: url, comment: comment, userID: userID});
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
    res.render('users/index', {users: data});
  });
});

app.post('/users', function (req, res) {
  var name = req.body;
  knex('users').insert(name).then(function () {
      res.redirect('/users');
    })
});

app.delete('/users', function (req, res) {
  knex('users').where(req.body).del().then(function () {
    res.redirect('/users');
  })
});

app.get('/users/edit', function (req, res) {
  var url = req.url.split('=');
  var userID = url.pop();
  knex('users').where({id: userID}).first().then(function (data) {
    res.render('users/edit', {user: data});
  });
});

app.put('/users/edit', function (req, res) {
  var update = req.body;
  knex('users').where({id: update.userID}).update({username: update.name}).then(function () {
    res.redirect('/users');
  })
});


app.get('/users/new', function (req, res) {
  res.render('users/new', {data: 'hi'});
});

app.get('/users/:userID', function (req, res) {
  var userID = req.params.userID
  var url = req.url
  knex.table('users').where({id: userID}).first().then(function (user) {
    knex.table('posts').where({user_id: userID}).then(function (posts) {
      res.render('users/id', {user: user, url: url, userID: userID, posts: posts});
    })
  });
});

app.delete('/comments', function (req, res) {
  var del = req.body;
  console.log(del);
  knex('comments').where(del).del().then(function () {
    res.redirect('back');
  })
});

app.get('/posts/:postID/edit', function (req, res) {
  var request = req.body;

  var url = req.url.split('=');
  var commentID = url.pop();
  knex('comments').where({id: commentID}).first().then(function (data) {
    res.render('posts/comments', {comment: data})
  })
});

app.put('/posts/:postID/edit', function (req, res) {
  var request = req.body;

  knex('comments').where({id: request.id}).update({comment_content: request.comment_content}).then(function (data) {
    res.redirect('/posts/' + request.post_id + '?user=' + request.user_id)
  })
});

app.listen(PORT, function (){
  console.log('server is running!');
});

module.exports = app;
