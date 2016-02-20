'use strict';

import restify from 'restify';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import bindRoutes from './routes';

let app = restify.createServer({
  name: 'infinityBoard'
});

export default function runServer(modules) {
  passport.use(new passportJWT.JWTStrategy(opt, function (payload, done) {
    modules.user.get({ id: payload.sub }).then(
      (result) => done(null, result || false),
      (err) => done(err, false)
    );
  }));
  
  bindRoutes(app, modules, passport);

  let opt = {
    jwtFromRequest: passportJWT.ExtractJWT.fromAuthHeader(),
    secretOrKey: 'secret'
  };

  let port = process.env.PORT || 9000;

  app.listen(port, () => console.log('server running on port ' + port));
}