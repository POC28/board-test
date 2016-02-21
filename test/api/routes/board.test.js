/*jshint -W030 */

'use strict';

import jwt from 'jsonwebtoken';

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
  let token;
  let user = {
    username: 'username',
    password: 'password',
    email: 'b@b.com'
  };

  before((done) => {
    MongoClient.connect(mongoURL, (err, database) => {
      if(err) {
        throw new Error(err);
      }

      db = database;
      let modules = setupModules(db);
      server = runServer(modules);

      modules.user.register(Object.assign({}, user)).then(() => {
        modules.user.login(user).then(data => {
          token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 86400 });
          done();
        }, done);
      }, done);
    });
  });

  context('/boards', () => {
    let board_id;

    it('POST should return a 401 if jwt token is missing', done => {
      client.post('/boards', {}, (err, req, res) => {
        res.statusCode.should.equal(401);
        done();
      });
    });

    it('POST should create a new board', done => {
      client.headers.authorization = 'JWT ' + token;

      let board = { title: 'board' };

      client.post('/boards', board, (err, req, res, obj) => {
        if(err) {
          return done(err);
        }

        obj.should.exist;
        obj.title.should.equal(board.title);
        board_id = obj.id;
        done();
      });
    });

    it('PUT /:id should return a 401 if jwt token is missing', done => {
      client.headers.authorization = null;

      client.put('/boards/something', {}, (err, req, res) => {
        res.statusCode.should.equal(401);
        done();
      });
    });

    it('PUT /:id should update a board', done => {
      client.headers.authorization = 'JWT ' + token;

      let updates = { title: 'another title' };

      client.put('/boards/' + board_id, updates, (err, req, res, obj) => {
        if(err) {
          return done(err);
        }

        obj.should.exist;
        obj.id.should.equal(board_id);
        done();
      });
    });

    it('PUT /:id with nonexistent id should return a 404', done => {
      client.put('/boards/abcdefabcdef', {}, (err, req, res) => {
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('GET /:id should return a 401 if jwt token is missing', done => {
      client.headers.authorization = null;

      client.get('/boards/something', (err, req, res) => {
        res.statusCode.should.equal(401);
        done();
      });
    });

    it('GET /:id should return a board', done => {
      client.headers.authorization = 'JWT ' + token;

      client.get('/boards/' + board_id, (err, req, res, obj) => {
        if(err) {
          return done(err);
        }

        obj.should.exist;
        obj.title.should.equal('another title');
        obj.id.should.equal(board_id);
        done();
      });
    });

    it('GET /:id with nonexistent id should return a 404', done => {
      client.get('/boards/abcdefabcdef', (err, req, res) => {
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('GET should return a 401 if jwt token is missing', done => {
      client.headers.authorization = null;

      client.get('/boards', (err, req, res) => {
        res.statusCode.should.equal(401);
        done();
      });
    });

    it('GET all should return all boards', done => {
      client.headers.authorization = 'JWT ' + token;

      client.get('/boards', (err, req, res, obj) => {
        if(err) {
          return done(err);
        }

        obj.length.should.equal(1);
        done();
      });
    });

    it('DELETE /:id should return a 401 if jwt token is missing', done => {
      client.headers.authorization = null;

      client.del('/boards/abc', (err, req, res) => {
        res.statusCode.should.equal(401);
        done();
      });
    });

    it('DELETE /:id should delete a board', done => {
      client.headers.authorization = 'JWT ' + token;

      client.del('/boards/' + board_id, (err, req, res) => {
        if(err) {
          return done(err);
        }
        
        res.statusCode.should.equal(204);
        done();
      });
    });

    it('DELETE /:id with nonexistent id should return a 404', done => {
      client.del('/boards/abcdefabcdef', (err, req, res) => {
        res.statusCode.should.equal(404);
        done();
      });
    });

  });

  after(done => {
    server.close();
    db.dropDatabase(() => done());
  });

});