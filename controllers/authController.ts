const { ObjectId } = require('mongodb');
const mongodb = require('../db/connection.ts');
import type { Request, Response , NextFunction} from 'express';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
};

module.exports = {
  isLoggedIn,
  logout
};

