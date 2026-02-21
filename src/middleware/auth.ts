
import type { Request, Response, NextFunction } from 'express';

const auth = {

    ensureAuth: function (req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    },
    ensureGuest: function (req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) {
            res.redirect('/user/google/' + req.user.googleId);
        }else {
            return next();
        }
    }
};

export const { ensureAuth, ensureGuest } = auth;
export default auth;