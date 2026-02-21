"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureGuest = exports.ensureAuth = void 0;
const auth = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/login');
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/user/google/' + req.user.googleId);
        }
        else {
            return next();
        }
    }
};
exports.ensureAuth = auth.ensureAuth, exports.ensureGuest = auth.ensureGuest;
exports.default = auth;
