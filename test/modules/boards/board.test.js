/*jshint -W030 */

'use strict';

import {Board} from '../../helpers';

describe('Board', () => {
  let board;
  let mockRepo = {
    save: function() {},
    update: function() {},
    get: function() {},
    delete: function() {}
  };

  before(() => board = new Board(mockRepo));

  it('should set the repository', () => {
    board.repository.should.eql(mockRepo);
  });
});