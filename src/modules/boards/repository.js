'use strict';

import {ObjectID} from 'mongodb';

export default class BoardRepository {
  constructor(db) {
    this.collection = db.collection('boards');
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.collection.find({}).toArray().then(results => {
        results = results.map(item => {
          item.id = item._id;
          delete item._id;
          return item;
        });

        resolve(results);
      }, reject);
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ _id: new ObjectID(id) }).then(result => {
        if (!result) {
          return resolve(404);
        }

        result.id = result._id;
        delete result._id;
        resolve(result);
      }, reject);
    });
  }

  create(board) {
    return new Promise((resolve, reject) => {
      this.collection.insert(board).then(result => {
        result = result.ops[0];
        result.id = result._id;
        delete result._id;
        resolve(result);
      }, reject);
    });
  }

  update(id, updates) {
    return new Promise((resolve, reject) => {
      this.collection.updateOne({ _id: new ObjectID(id) }, updates).then(result => {
        let res = result.result.nModified > 0 ? { id: id } : null;
        resolve(res);
      }, reject);
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.collection.deleteOne({ _id: new ObjectID(id) }).then(result => {
        resolve(result.deletedCount);
      }, reject);
    });
  }
}