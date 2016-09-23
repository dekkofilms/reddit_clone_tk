var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server');
var config = require('../knexfile.js')['test'];
var knex = require('knex')(config);

describe('find initial route', function() {
  it('should go to home page', function(done) {
    request(app).get('/')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });
});

describe('find new post page', function() {

  it('should go to post page', function(done) {
    request(app).get('/posts')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });

  it('should add post to database', function(done) {
    request(app).post('/users')
      .send({username: 'Taylor'})
      .end(function (err, res) {
        knex('users').first('id').then(function (id) {
          request(app).post('/posts')
          .send({post_content: 'this is a testing post', user_id: id.id, post_link: 'www.google.com'})
          .end(function (err, res) {
            knex.select().table('posts').then(function (data) {
              expect(data[0].post_content).to.include('this is a testing post');
              done();
            })
          });
        })
      })
  });

  it('should find this specific post in the database', function(done) {
    var postID;
    var postContent;
    knex('posts').first('id').then(function (data) {
      postID = data['id'];
      postContent = data['post_content'];
      var param = '/posts/' + postID;
      request(app).get(param)
        .end(function (err, res) {
          expect(res.text).to.include('this is a testing post');
          done();
        });
    })
  });
});

describe('comment route', function() {
  it('should post a comment to specific post page', function(done) {
    request(app).post('/posts/:postID')
      .send({comment_content: 'this is a test comment'})
      .end(function (err, res) {
        knex('comments').first().then (function (data) {
          console.log("data:" + data);
          // expect(res.text).to.include('this is a test comment');
          done();
        })
      });
  });
});

describe('/users', function() {

  after(function(done) {
    knex.raw('TRUNCATE TABLE users CASCADE').then(function () {
      done();
    });
  });

  it('should go to user page', function(done) {
    request(app).get('/users')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });

  var user = {username: 'Taylor'};
  it('should list all of the current users', function(done) {
    request(app).post('/users')
      .send(user)
      .end(function (err, res) {
        request(app).get('/users').end(function (err, res) {
          expect(res.text).to.include('Taylor')
          done();
        })
      });
  });
});

describe('/users/new', function() {
  it('should go to new user page', function(done) {
    request(app).get('/users/new')
      .expect(200)
      .end(function (err, res) {
        expect(err).to.equal(null);
        done();
      });
  });

  it('should have the proper form', function(done) {
    request(app).get('/users/new')
      .end(function (err, res) {
        expect(res.text).to.include('<input type="text" name="username">');
        done();
      });
  });
});
