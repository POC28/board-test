'use strict';

import {MongoClient} from 'mongodb';
import restify from 'restify';

import setupModules from '../../lib/modules';
import runServer from '../../lib/api/app';
import {should} from '../helpers';

let client = restify.createJsonClient({
  url: 'http://localhost:' + (process.env.PORT || '9000')
});

let mongoURL = 'mongodb://localhost:27017/infinityboard_test';

describe('Server', () => {
  let server;

  before((done) => {
    MongoClient.connect(mongoURL, (err, db) => {
      if(err) {
        throw new Error(err);
      }

      server = runServer(setupModules(db));
      done();
    });
  });

  context('Board routes', () => {

    it('POST should create a new board', (done) => {
      let board = { title: 'board' };

      client.post('/boards', board, (err, req, res, obj) => {
        console.log(obj);
        should.not.exist(err);
        obj.should.exist;
        obj.title.should.equal(board.title);
        done();
      });
    });

  });

  after(() => {
    server.close();
  });

});