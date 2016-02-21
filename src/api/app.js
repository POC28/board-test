'use strict';

import restify from 'restify';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import bindRoutes from './routes';

let app = restify.createServer({
  name: 'infinityBoard'
});

restify.CORS.ALLOW_HEADERS.push("authorization");
restify.CORS.ALLOW_HEADERS.push("withcredentials");
restify.CORS.ALLOW_HEADERS.push("x-requested-with");
restify.CORS.ALLOW_HEADERS.push("x-forwarded-for");
restify.CORS.ALLOW_HEADERS.push("x-real-ip");
restify.CORS.ALLOW_HEADERS.push("x-customheader");
restify.CORS.ALLOW_HEADERS.push("user-agent");
restify.CORS.ALLOW_HEADERS.push("keep-alive");
restify.CORS.ALLOW_HEADERS.push("host");
restify.CORS.ALLOW_HEADERS.push("accept");
restify.CORS.ALLOW_HEADERS.push("connection");
restify.CORS.ALLOW_HEADERS.push("upgrade");
restify.CORS.ALLOW_HEADERS.push("content-type");
restify.CORS.ALLOW_HEADERS.push("dnt"); // Do not track
restify.CORS.ALLOW_HEADERS.push("if-modified-since");
restify.CORS.ALLOW_HEADERS.push("cache-control");

app.on("MethodNotAllowed", function (request, response) {
  if (request.method.toUpperCase() === "OPTIONS") {
    response.header("Access-Control-Allow-Credentials", true);
    response.header("Access-Control-Allow-Headers", restify.CORS.ALLOW_HEADERS.join(", "));
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.header("Access-Control-Allow-Origin", request.headers.origin);
    response.header("Access-Control-Max-Age", 0);
    response.header("Content-type", "text/plain charset=UTF-8");
    response.header("Content-length", 0);
    response.send(204);
  } else {
    response.send(new restify.MethodNotAllowedError());
  }
});

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.CORS());

export default function runServer(modules) {
  let opt = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.JWT_SECRET
  };

  passport.use(new passportJWT.Strategy(opt, function (payload, done) {
    modules.user.getByUsername(payload.username).then(
      (result) => done(null, result || false),
      (err) => done(err, false)
    );
  }));

  app.get('/', (req, res, next) => {
    res.send({
      routes: 'Routes will appear here later'
    });
    next();
  });

  bindRoutes(app, modules, passport);

  let port = process.env.PORT || 9000;

  app.listen(port);
  return app;
}