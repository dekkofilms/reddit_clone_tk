var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../server');

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
