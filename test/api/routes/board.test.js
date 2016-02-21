/*jshint -W030 */

'use strict';

import {
  MongoClient,
  setupModules,
  runServer,
  client
} from '../serverUtils';

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

  context('/boards', () => {
    let board_id;

    it('POST should create a new board', done => {
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

    it('PUT should update a board', done => {
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

    it('PUT with nonexistent id should return a 404', done => {
      client.put('/boards/abcdefabcdef', {}, (err, req, res) => {
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('GET with id should return a board', done => {
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

    it('GET with nonexistent id should return a 404', done => {
      client.get('/boards/abcdefabcdef', (err, req, res) => {
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('GET all should return all boards', done => {
      client.get('/boards', (err, req, res, obj) => {
        if(err) {
          return done(err);
        }

        obj.length.should.equal(1);
        done();
      });
    });

    it('DELETE with id should delete a board', done => {
      client.del('/boards/' + board_id, (err, req, res) => {
        if(err) {
          return done(err);
        }
        
        res.statusCode.should.equal(204);
        done();
      });
    });

    it('DELETE with nonexistent id should return a 404', done => {
      client.del('/boards/abcdefabcdef', (err, req, res) => {
        res.statusCode.should.equal(404);
        done();
      });
    });

  });

  after(() => {
    server.close();
    db.dropDatabase();
  });

});