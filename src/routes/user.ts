import express from 'express';
import * as userController from '../controllers/userController';
import validator from '../utilities/validate';
import util from '../utilities/index';
import { ensureAuth, ensureGuest } from '../middleware/auth';

const router = express.Router();
//const { requiresAuth } = require('express-openid-connect');

// router.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });
router.get('/', util.handleErrors(userController.getAllUsers));
router.get('/google/:id', ensureAuth, util.handleErrors(userController.getUserByGoogleId));
router.get('/:id', util.handleErrors(userController.getUserById));
router.post('/', util.handleErrors(userController.createUser));
router.put('/:id', util.handleErrors(userController.updateUser));
router.delete('/:id', util.handleErrors(userController.deleteUser));

export default router;