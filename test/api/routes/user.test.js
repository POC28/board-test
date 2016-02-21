/*jshint -W030 */

'use strict';

import {
  MongoClient,
  setupModules,
  runServer,
  client
} from '../serverUtils';

process.env.JWT_SECRET = 'mymagicalsecret';
let mongoURL = 'mongodb://localhost/infinityboard_test';

describe('Server:', () => {
  let server;
  let db;

  before((done) => {
    MongoClient.connect(mongoURL, (err, database) => {
      if(err) {
        throw new Error(err);
      }

      db = database;
      server = runServer(setupModules(db));
      done();
    });
  });

  context('/users', () => {
    let token;

    let user = {
      username: 'username',
      password: 'password',
      email: 'a@b.com'
    };

    context('/register', () => {
      it('POST should register a new user', done => {
        client.post('/users/register', user, (err, req, res, obj) => {
          if(err) {
            return done(err);
          }

          obj.should.exist;
          obj.token.should.exist;
          obj.root_board.should.exist;
          obj.root_board.length.should.be.above(0);
          done();
        });
      });

      it('POST without username should return a 422', done => {
        client.post('/users/register', { password: 'a word' }, (err, req, res) => {
          res.statusCode.should.equal(422);
          done();
        });
      });

      it('POST without password should return a 422', done => {
        client.post('/users/register', { username: 'somename' }, (err, req, res) => {
          res.statusCode.should.equal(422);
          done();
        });
      });

      it('POST with existing username should return a 409', done => {
        client.post('/users/register', { username: 'username', password: 'abc123' }, (err, req, res) => {
          res.statusCode.should.equal(409);
          done();
        });
      });
    });

    context('/login', () => {
      it('POST with correct credentials should return a JWT', done => {
        client.post('/users/login', user, (err, req, res, obj) => {
          if(err) {
            return done(err);
          }

          obj.token.should.exist;
          token = obj.token;
          done();
        });
      });

      it('POST with invalid username should return a 401', done => {
        let invalidUser = {
          username: 'invalid',
          password: user.password
        };

        client.post('/users/login', invalidUser, (err, req, res) => {
          res.statusCode.should.equal(401);
          done();
        });
      });

      it('POST with invalid password should return a 401', done => {
        let invalidUser = {
          username: user.username,
          password: 'abc123'
        };

        client.post('/users/login', invalidUser, (err, req, res) => {
          res.statusCode.should.equal(401);
          done();
        });
      });
    });

    context('/current', () => {
      it('GET with token should return the current user', done => {
        client.headers.authorization = 'JWT ' + token;

        client.get('/users/current', (err, req, res, obj) => {
          if(err) {
            return done(err);
          }

          obj.should.exist;
          obj.username.should.equal(user.username);
          done();
        });
      });

      it('GET without access token should return a 401', done => {
        client.headers.authorization = null;

        client.get('/users/current', (err, req, res) => {
          res.statusCode.should.equal(401);
          done();
        });
      });

      it('GET with invalid access token should return a 401', done => {
        client.headers.authorization = 'JWT somethingwitty';

        client.get('/users/current', (err, req, res) => {
          res.statusCode.should.equal(401);
          done();
        });
      });
    });

    context('', () => {
      it('PUT without token should return a 401', done => {
        client.headers.authorization = null;

        client.put('/users', {}, (err, req, res) => {
          res.statusCode.should.equal(401);
          done();
        });
      });

      it('PUT should update the currently logged in user', done => {
        client.headers.authorization = 'JWT ' + token;

        client.put('/users', { email: 'updated@email.com' }, (err, req, res, obj) => {
          if(err) {
            return done(err);
          }

          obj.should.exist;
          obj.id.should.exist;
          done();
        });
      });
    });
  });

  after(() => {
    server.close();
    db.dropDatabase(done => done());
  });

});