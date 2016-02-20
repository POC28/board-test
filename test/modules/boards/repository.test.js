/*jshint -W030 */

'use strict';

import {BoardRepository} from '../../helpers';

describe('BoardRepository', () => {
  let repo;
  let mockDb = {
    save: function () {},
    update: function () {},
    get: function () {},
    delete: function () {}
  };

  before(() => repo = new BoardRepository(mockDb));

  it('should set the repository', () => {
    repo.db.should.eql(mockDb);
  });
});