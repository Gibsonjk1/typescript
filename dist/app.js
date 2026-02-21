"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const connection_1 = __importDefault(require("./db/connection"));
const passport_2 = __importDefault(require("./config/passport"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//const { auth } = require('express-openid-connect');
//const mongoose = require('mongoose');
(0, passport_2.default)(passport_1.default);
//Auth0 config
// app.use(auth({
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.AUTH0_SECRET,
//     baseURL: process.env.BASEURL,
//     clientID: 'Ckdlf15Dm7fItOyhhaa8e04En4r8swxh',
//     issuerBaseURL: 'https://dev-rdi2sd0vh0yhi4p6.us.auth0.com'
// }));
//Sessions
app.use((0, express_session_1.default)({
    secret: 'kittypoo ln',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
//passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//Coonect to Mongoose
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//     console.log('Connected to MongoDB via Mongoose');
//     app.listen(PORT, () => {
//         console.log(`Server is running: http://localhost:${PORT}`);
//     });
// })
// .catch((err: Error) => {
//     console.error('Error connecting to MongoDB via Mongoose:', err);
// });
//Connect to MongoDB first
connection_1.default.initDb((err, db) => {
    if (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit if database connection fails
    }
    else {
        // Set up middleware after DB is connected
        app
            .use(express_1.default.json())
            .use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            next();
        });
        // Set up routes after DB is connected
        Promise.resolve().then(() => __importStar(require('./routes/index'))).then((module) => {
            app.use('/', module.default);
        });
        // Start server after everything is set up
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
});
