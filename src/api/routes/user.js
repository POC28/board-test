'use strict';

let basePath = '/users';

let defaultErrorHandler = function (res, next) {
  return function (err) {
    res.send(500);
    next(err);
  };
};

export default function bootstrap (app, user) {
  app.post(basePath + '/register', (req, res, next) => {
    if(!req.body.username || !req.body.password) {
      res.send(422);
      return next();
    }

    user.register(req.body).then(result => {
      let status = 204;

      if(!result) {
        status = 409;
      }

      res.send(status);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.post(basePath + '/login', (req, res, next) => {
    user.login(req.body).then(result => {
      res.send(result ? result : 401);
      next();
    }, defaultErrorHandler(res, next));
  });

  /*
  app.get(basePath, (req, res, next) => {
    user.getAll().then(result => {
      res.send(result);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.get(basePath + '/:id', (req, res, next) => {
    user.get(req.params.id).then(result => {
      res.send(result || 404);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.post(basePath, (req, res, next) => {
    user.create(req.body).then(result => {
      res.send(result);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.put(basePath + '/:id', (req, res, next) => {
    user.update(req.params.id, req.body).then(result => {
      res.send(result || 404);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.del(basePath + '/:id', (req, res, next) => {
    user.delete(req.params.id).then(result => {
      res.send(result ? 204 : 404);
      next();
    }, defaultErrorHandler(res, next));
  });
  */
}