"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const mongodb_1 = require("mongodb");
const connection_1 = __importDefault(require("../db/connection"));
const Strategy = passport_google_oauth20_1.default.Strategy;
function default_1(passport) {
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName.toLowerCase(),
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            createdAt: new Date()
        };
        try {
            const db = connection_1.default.getDb().db('RandR');
            const userCollection = db.collection('User');
            // Try to find existing user
            let user = await userCollection.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            }
            else {
                // Create new user
                const result = await userCollection.insertOne(newUser);
                if (result.acknowledged) {
                    newUser._id = result.insertedId;
                    done(null, newUser);
                }
                else {
                    throw new Error('Failed to create user');
                }
            }
        }
        catch (err) {
            console.error('Passport error:', err);
            done(err, null);
        }
    }));
    passport.serializeUser((user, done) => {
        // Store just the user's MongoDB _id in the session
        done(null, user._id.toString());
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const db = connection_1.default.getDb().db('RandR');
            const user = await db.collection('User').findOne({ _id: new mongodb_1.ObjectId(id) });
            done(null, user);
        }
        catch (err) {
            done(err, null);
        }
    });
}
