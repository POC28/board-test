'use strict';

import {ObjectID} from 'mongodb';

export default class BoardRepository {
  constructor(db) {
    this.collection = db.collection('boards');
  }

  getAll() {
    return this.collection.find({}).toArray();
  }

  get(id) {
    return this.collection.findOne({ _id: new ObjectID(id) });
  }

  create(board) {
    return new Promise((resolve, reject) => {
      this.collection.insert(board).then(result => {
        resolve(result.ops[0]);
      }, reject);
    });
  }

  update(id, updates) {
    return new Promise((resolve, reject) => {
      this.collection.updateOne({ _id: new ObjectID(id) }, updates).then(result => {
        let res = result.result.nModified > 0 ? {} : null;
        resolve(res);
      }, reject);
    });
  }

  delete(id) {
    return this.collection.deleteOne({ _id: new ObjectID(id) });
  }
}