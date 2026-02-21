"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exercise_1 = __importDefault(require("./exercise"));
const swagger_1 = __importDefault(require("./swagger"));
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
const router = express_1.default.Router();
router.use('/exercise', exercise_1.default);
router.use('/user', user_1.default);
router.use('/api-docs', swagger_1.default);
router.use('/auth', auth_1.default);
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
exports.default = router;
