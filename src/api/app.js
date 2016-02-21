'use strict';

import restify from 'restify';
import passport from 'passport';
//import passportJWT from 'passport-jwt';
import bindRoutes from './routes';

let app = restify.createServer({
  name: 'infinityBoard'
});

app.use(restify.bodyParser());
app.use(restify.CORS());

export default function runServer(modules) {
  /*
  let opt = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeader(),
    secretOrKey: 'secret'
  };

  passport.use(new passportJWT.Strategy(opt, function (payload, done) {
    modules.user.get({ id: payload.sub }).then(
      (result) => done(null, result || false),
      (err) => done(err, false)
    );
  }));
  */

  bindRoutes(app, modules, passport);

  let port = process.env.PORT || 9000;

  app.listen(port);
  return app;
}