'use strict';

import {MongoClient} from 'mongodb';
import restify from 'restify';

import {should} from '../helpers';
import setupModules from '../../lib/modules';
import runServer from '../../lib/api/app';

let client = restify.createJsonClient({
  url: 'http://localhost:' + (process.env.PORT || '9000')
});

export {
  MongoClient,
  restify,
  should,
  setupModules,
  runServer,
  client
};