/*jshint -W030 */

'use strict';

import {MongoClient} from 'mongodb';
import restify from 'restify';

import {should} from '../helpers';
import setupModules from '../../lib/modules';
import runServer from '../../lib/api/app';

let client = restify.createJsonClient({
  url: 'http://localhost:' + (process.env.PORT || '9000')
});

let mongoURL = 'mongodb://localhost/infinityboard_test';

describe('Server', () => {
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

  context('Board routes', () => {
    let board_id;

    it('POST should create a new board', done => {
      let board = { title: 'board' };

      client.post('/boards', board, (err, req, res, obj) => {
        should.not.exist(err);
        obj.should.exist;
        obj.title.should.equal(board.title);
        board_id = obj._id;
        done();
      });
    });

    it('PUT should update a board', done => {
      let updates = { title: 'another title' };

      client.put('/boards/' + board_id, updates, (err, req, res, obj) => {
        should.not.exist(err);
        obj.should.exist;
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
        should.not.exist(err);
        obj.should.exist;
        obj.title.should.equal('another title');
        obj._id.should.equal(board_id);
        done();
      });
    });

    it('DELETE with id should delete a board', done => {
      client.del('/boards/' + board_id, (err, req, res) => {
        should.not.exist(err);
        res.statusCode.should.equal(204);
        done();
      });
    });

  });

  after(() => {
    server.close();
    db.dropDatabase(() => db.close());
  });

});