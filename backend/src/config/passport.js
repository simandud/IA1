const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if email already exists
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          if (!user.avatar && profile.photos && profile.photos.length > 0) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
          password: Math.random().toString(36).slice(-8), // Random password for OAuth users
          isActive: true,
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ facebookId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if email already exists
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (email) {
          user = await User.findOne({ email });

          if (user) {
            // Link Facebook account to existing user
            user.facebookId = profile.id;
            if (!user.avatar && profile.photos && profile.photos.length > 0) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        user = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email: email,
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
          password: Math.random().toString(36).slice(-8), // Random password for OAuth users
          isActive: true,
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
