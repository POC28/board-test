'use strict';

import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import {ObjectID} from 'mongodb';

function getPasswordHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function comparePasswordHash(password, passwordHash) {
  let result = bcrypt.compareSync(password, passwordHash);
  return result;
}

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

        user.password = getPasswordHash(user.password);

        this.collection.insert(user).then(result => {
          resolve(result.ops[0]);
        }, reject);
      }, reject);
    });
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ username: credentials.username }).then(user => {
        if(!user || !comparePasswordHash(credentials.password, user.password)) {
          return resolve(null);
        }

        let token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 86400 });
        resolve({ token: token });
      }, reject);
    });
  }
}