'use strict';

export default class Board {
  constructor(repository) {
    this.repository = repository;
  }

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
}