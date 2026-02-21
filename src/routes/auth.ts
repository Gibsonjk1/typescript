import express from 'express';
import * as authController from '../controllers/authController';
import util from '../utilities/index';
import passport from 'passport';
import type { Request, Response } from 'express';

const router = express.Router();

interface GoogleUser {
  googleId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  image?: string;
  createAt?: Date;
}

declare global {
  namespace Express {
    interface User extends GoogleUser {}
  }
}

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/exercise' }),
    (req: Request, res: Response) => {
        // Successful authentication, redirect home.
        console.log('Authenticated User:', req.user);
        res.redirect('/user/google/' + req.user?.googleId); // Redirect to user profile or desired page
    }
);
router.get('/logout', util.handleErrors(authController.logout));

//router.get('/login', util.handleErrors(authController.isloggedIn));

//router.post('/login', passport.authenticate('local'), util.handleErrors(authController.login));

export default router;