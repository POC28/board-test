'use strict';

import boardRoutes from './board';
import userRoutes from './user';

export default function bindRoutes(app, modules) {
  boardRoutes(app, modules);
  userRoutes(app, modules);
}