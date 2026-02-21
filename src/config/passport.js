const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { ObjectId } = require('mongodb');
const mongodb = require('../db/connection.ts');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName.toLowerCase(),
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            createdAt: new Date()
        };

        try {
            const db = mongodb.getDb().db('RandR');
            const userCollection = db.collection('User');
            
            // Try to find existing user
            let user = await userCollection.findOne({ googleId: profile.id });
            
            if (user) {
                done(null, user);
            } else {
                // Create new user
                const result = await userCollection.insertOne(newUser);
                if (result.acknowledged) {
                    newUser._id = result.insertedId;
                    done(null, newUser);
                } else {
                    throw new Error('Failed to create user');
                }
            }
        } catch (err) {
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
            const db = mongodb.getDb().db('RandR');
            const user = await db.collection('User').findOne({ _id: new ObjectId(id) });
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};