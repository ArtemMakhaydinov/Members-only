const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Connection = require('./database');
const User = require('../models/user-model');
const validPassword = require('../lib/password-utils').validPassword;

const verifyCallback = (username, password, done) => {
    User.findOne({ username })
        .then((user) => {
            if (!user) {
                return done(null, user);
            }

            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});
