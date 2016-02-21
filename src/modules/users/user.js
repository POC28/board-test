'use strict';

import bcrypt from 'bcrypt-nodejs';

export default class User {
  constructor(repository) {
    this.repository = repository;
  }

  register(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    return this.repository.register(user);
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      this.repository.getByUsername(credentials.username).then(user => {
        if(!user || !bcrypt.compareSync(credentials.password, user.password)) {
          return resolve(false);
        }

        resolve(user);
      }, reject);
    });
  }

  /*
  getAll() {
    return this.repository.getAll();
  }

  get(id) {
    return this.repository.get(id);
  }

  create(board) {
    return this.repository.create(board);
  }

  update(id, updates) {
    return this.repository.update(id, updates);
  }

  delete(id) {
    return this.repository.delete(id);
  }
  */
}