'use strict';

import Board from './boards/board';
import BoardRepository from './boards/repository';

export default function setupModules(db) {
  return {
    board: new Board(new BoardRepository(db))
  };
}