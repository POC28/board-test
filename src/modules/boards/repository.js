'use strict';

export default class BoardRepository {
  constructor(db) {
    this.collection = db.collection('boards');
  }

  getAll() {
    return this.collection.find({}).toArray();
  }

  get(id) {
    return this.collection.findOne({ _id: id });
  }

  create(board) {
    return this.collection.insert(board);
  }

  update(id, updates) {
    return this.collection.updateOne({ _id: id }, updates);
  }

  delete(id) {
    return this.collection.deleteOne({ _id: id });
  }
}