'use strict';

import Board from './boards/board';
import BoardRepository from './boards/repository';
import User from './users/user';
import UserRepository from './users/repository';

export default function setupModules(db) {
  let boardRepository = new BoardRepository(db);
  let userRepository = new UserRepository(db);

  return {
    board: new Board(boardRepository),
    user: new User(userRepository, boardRepository)
  };
}