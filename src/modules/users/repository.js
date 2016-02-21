'use strict';

import {ObjectID} from 'mongodb';

export default class UserRepository {
  constructor(db) {
    this.collection = db.collection('users');
  }

  register(user) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ username: user.username }).then(existing => {
        if(existing) {
          return resolve(null);
        }

        this.collection.insert(user).then(result => {
          resolve(result.ops[0]);
        }, reject);
      }, reject);
    });
  }

  getByUsername(username) {
    return this.collection.findOne({ username: username });
  }
}