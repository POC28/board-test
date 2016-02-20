'use strict';

import restify from 'restify';
import bindRoutes from './routes'; 

let app = restify.createServer({
  name: 'infinityBoard'
});

export default function runServer(modules) {
  bindRoutes(app, modules);

  let port = process.env.PORT || 9000;

  app.listen(port, () => console.log('server running on port ' + port));
}