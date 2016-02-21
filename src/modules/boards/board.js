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

  getChildren(id) {
    return new Promise((resolve, reject) => {
      this.repository.get(id).then(board => {
        if(!board.children || board.children.length === 0) {
          return resolve([]);
        }

        this.repository.getList(board.children).then(resolve, reject);
      }, reject);
    });
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