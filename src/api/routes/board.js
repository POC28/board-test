'use strict';

let path = 'boards';

export default function bootstrap (app, board) {
  app.get(`/${path}`, (req, res, next) => {
    return board.getAll().then((result) => {
      res.send(result);
      next();
    });
  });
}