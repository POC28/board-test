'use strict';

import passport from 'passport';
import jwt from 'jsonwebtoken';

let basePath = '/boards';

let defaultErrorHandler = function (res, next) {
  return function (err) {
    res.send(500, err);
    next(err);
  };
};

export default function bootstrap (app, modules) {
  app.get(basePath, passport.authenticate('jwt', { session: false }), (req, res, next) => {
    modules.board.getAll().then(result => {
      res.send(result);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.get(basePath + '/root', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
        res.send(401);
        return next();
      }
      
      modules.board.get(decoded.root_board).then(result => {
        res.send(result || 404);
        next();
      }, defaultErrorHandler(res, next));
    });
  });

  app.get(basePath + '/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    modules.board.get(req.params.id).then(result => {
      res.send(result || 404);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.get(basePath + '/:id/children', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    modules.board.getChildren(req.params.id).then(result => {
      res.send(result || 404);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.post(basePath, passport.authenticate('jwt', { session: false }), (req, res, next) => {
    modules.board.create(req.body).then(result => {
      res.send(result);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.put(basePath + '/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    modules.board.update(req.params.id, req.body).then(result => {
      res.send(result || 404);
      next();
    }, defaultErrorHandler(res, next));
  });

  app.del(basePath + '/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    modules.board.delete(req.params.id).then(result => {
      res.send(result ? 204 : 404);
      next();
    }, defaultErrorHandler(res, next));
  });
}