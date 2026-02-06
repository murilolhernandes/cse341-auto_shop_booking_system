const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

// Setup the passport authentication using Google OAuth2.0
module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL // Remove the '_DEV' for production
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = mongodb.getDb().db();

        let user = await db.collection('users').findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await db.collection('users').updateOne(
              { _id: user._id },
              { $set: { googleId: profile.id } }
            );
            user.googleId = profile.id;
            console.log("Linked Google account to existing local user.");
          }
          return done(null, user);
        } else {
          const newUser = {
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
          };
          const result = await db.collection('users').insertOne(newUser);
          newUser._id = result.insertedId;
          return done(null, newUser);
        }
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const db = mongodb.getDb().db();
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      done(null, user);
      } catch (err) {
        done(err, null);
      }
  });
}