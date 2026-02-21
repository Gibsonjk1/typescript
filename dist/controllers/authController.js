"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.isLoggedIn = void 0;
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
exports.isLoggedIn = isLoggedIn;
const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
};
exports.logout = logout;
