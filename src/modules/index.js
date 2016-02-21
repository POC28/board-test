'use strict';

import Board from './boards/board';
import BoardRepository from './boards/repository';
import User from './users/user';
import UserRepository from './users/repository';

export default function setupModules(db) {
  return {
    board: new Board(new BoardRepository(db)),
    user: new User(new UserRepository(db))
  };
}