'use strict';

import boardRoutes from './board';

export default function bindRoutes(app, modules) {
  boardRoutes(app, modules.board);
}