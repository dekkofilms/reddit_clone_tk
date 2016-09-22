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

describe('/users', function() {

  after(function(done) {
    knex('users').truncate().then(function () {
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
