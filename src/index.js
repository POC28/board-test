'use strict';

import {MongoClient} from 'mongodb';

import setupModules from './modules';
import runServer from './api/app';

let mongoURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/infinityboard';

MongoClient.connect(mongoURL, (err, db) => {
  if(err) {
    throw new Error(err);
  }

  console.log('connected to mongodb at ' + mongoURL);

  runServer(setupModules(db));
});