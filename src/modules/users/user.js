'use strict';

export default class User {
  constructor(repository) {
    this.repository = repository;
  }

  register(user) {
    return this.repository.register(user);
  }

  login(credentials) {
    return this.repository.login(credentials);
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