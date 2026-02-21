import GoogleStrategy from 'passport-google-oauth20';
import { ObjectId } from 'mongodb';
import mongodb from '../db/connection';
import type { PassportStatic } from 'passport';

const Strategy = (GoogleStrategy as any).Strategy;

export default function(passport: PassportStatic) {
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        const newUser: any = {
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

    passport.serializeUser((user: any, done: any) => {
        // Store just the user's MongoDB _id in the session
        done(null, user._id.toString());
    });

    passport.deserializeUser(async (id: any, done: any) => {
        try {
            const db = mongodb.getDb().db('RandR');
            const user = await db.collection('User').findOne({ _id: new ObjectId(id) });
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}
