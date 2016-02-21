'use strict';

import passport from 'passport';

let basePath = '/boards';

let defaultErrorHandler = function (res, next) {
  return function (err) {
    res.send(500);
    next(err);
  };
};

export default function bootstrap (app, board) {
  app.get(basePath, passport.authenticate('jwt', { session: false }), (req, res, next) => {
    board.getAll().then(result => {
      res.send(result);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.get(basePath + '/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    board.get(req.params.id).then(result => {
      res.send(result || 404);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.post(basePath, passport.authenticate('jwt', { session: false }), (req, res, next) => {
    board.create(req.body).then(result => {
      res.send(result);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.put(basePath + '/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    board.update(req.params.id, req.body).then(result => {
      res.send(result || 404);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.del(basePath + '/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    board.delete(req.params.id).then(result => {
      res.send(result ? 204 : 404);
      next();
    }, defaultErrorHandler(res, next));
  });
}