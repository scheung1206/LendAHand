'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var app = require('../..');

var User = require('../user/user.model');

var newPost;

describe('Post API:', function () {
  var user;
  before(function () {
    return User.removeAsync().then(function () {
      user = new User({
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password'
      });

      return user.saveAsync();
    });
  });

  var token;
  before(function (done) {
    (0, _supertest2['default'])(app).post('/auth/local').send({
      email: 'test@test.com',
      password: 'password'
    }).expect(200).expect('Content-Type', /json/).end(function (err, res) {
      token = res.body.token;
      done();
    });
  });

  describe('GET /api/posts', function () {
    var posts;

    beforeEach(function (done) {
      (0, _supertest2['default'])(app).get('/api/posts').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        posts = res.body;
        done();
      });
    });

    it('should respond with JSON array', function () {
      posts.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/posts', function () {
    beforeEach(function (done) {
      (0, _supertest2['default'])(app).post('/api/posts').set('authorization', 'Bearer ' + token).send({
        title: 'New Post',
        description: 'This is the brand new post!!!'
      }).expect(201).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        newPost = res.body;
        done();
      });
    });

    it('should respond with the newly created post', function () {
      newPost.title.should.equal('New Post');
      newPost.description.should.equal('This is the brand new post!!!');
    });
  });

  describe('GET /api/posts/:id', function () {
    var post;

    beforeEach(function (done) {
      (0, _supertest2['default'])(app).get('/api/posts/' + newPost._id).expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        post = res.body;
        done();
      });
    });

    afterEach(function () {
      post = {};
    });

    it('should respond with the requested post', function () {
      post.title.should.equal('New Post');
      post.description.should.equal('This is the brand new post!!!');
    });
  });

  describe('PUT /api/posts/:id', function () {
    var updatedPost;

    beforeEach(function (done) {
      (0, _supertest2['default'])(app).put('/api/posts/' + newPost._id).set('authorization', 'Bearer ' + token).send({
        title: 'Updated Post',
        description: 'This is the updated post!!!'
      }).expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        updatedPost = res.body;
        done();
      });
    });

    afterEach(function () {
      updatedPost = {};
    });

    it('should respond with the updated post', function () {
      updatedPost.title.should.equal('Updated Post');
      updatedPost.description.should.equal('This is the updated post!!!');
    });
  });

  describe('DELETE /api/posts/:id', function () {

    it('should respond with 204 on successful removal', function (done) {
      (0, _supertest2['default'])(app)['delete']('/api/posts/' + newPost._id).set('authorization', 'Bearer ' + token).expect(204).end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
    });

    it('should respond with 404 when post does not exist', function (done) {
      (0, _supertest2['default'])(app)['delete']('/api/posts/' + newPost._id).set('authorization', 'Bearer ' + token).expect(404).end(function (err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });

  /* describe('PUT /api/things/:id', function() {
    }); */
});
//# sourceMappingURL=post.integration.js.map
