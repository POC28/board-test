'use strict';

import {ObjectID} from 'mongodb';

export default class UserRepository {
  constructor(db) {
    this.collection = db.collection('users');
  }

  register(user) {
    user = Object.assign({}, user);

    return new Promise((resolve, reject) => {
      this.collection.findOne({ username: user.username }).then(existing => {
        if(existing) {
          return resolve(null);
        }

        this.collection.insert(user).then(result => {
          let user = result.ops[0];
          user.id = user._id;
          delete user._id;
          resolve(user);
        }, reject);
      }, reject);
    });
  }

  getByUsername(username) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ username: username }).then(user => {
        if(!user) {
          return resolve(user);
        }

        user.id = user._id;
        delete user._id;
        resolve(user);
      }, reject);
    });
  }

  update(id, updates) {
    return new Promise((resolve, reject) => {
      this.collection.updateOne({ _id: new ObjectID(id) }, { $set: updates }).then(result => {
        let res = result.result.nModified > 0 ? { id: id } : null;
        resolve(res);
      }, reject);
    });
  }
}