'use strict';

let path = 'user';

export default function bootstrap (app, board) {
  app.post(`/${path}/login`, (req, res, next) => {
    return user.login(req.body.username, req.body.password).then((result) => {
      res.send(result);
      next();
    }, (err) => {
      res.send(err);
      next();
    });
  });
}