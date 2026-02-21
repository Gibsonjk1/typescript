import express from 'express';
import exerciseRouter from './exercise';
import swaggerRouter from './swagger';
import userRouter from './user';
import authRouter from './auth';

const router = express.Router();


router.use('/exercise', exerciseRouter);
router.use('/user', userRouter);
router.use('/api-docs', swaggerRouter);
router.use('/auth', authRouter);

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.AUTH0_SECRET,
//   baseURL: process.env.BASEURL,
//   clientID: 'Ckdlf15Dm7fItOyhhaa8e04En4r8swxh',
//   issuerBaseURL: 'https://dev-rdi2sd0vh0yhi4p6.us.auth0.com'
// };

// // auth router attaches /login, /logout, and /callback routes to the baseURL
// router.use(auth(config));

// req.isAuthenticated is provided from the auth router
// router.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });
export default router;