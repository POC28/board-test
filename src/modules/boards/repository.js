'use strict';

export default class BoardRepository {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return new Promise((resolve, reject) => resolve([{ id: 1, name: 'abc' }, { id: 2, name: 'def' }]));
  }
}