const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleTokenStrategy = require('passport-google-plus-token');
const FacebookStrategy = require('passport-facebook-token');
const User = require('mongoose').model('User');
const config = require('./config');


// JWT Strategy 
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWTsecret
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));

// Google Strategy
passport.use('googleToken', new GoogleTokenStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ 'google.id': profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({
            method: 'google',
            google: {
                id: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value
            }
        }).save();
        done(null, user);
    } catch (err) {
        done(err, null, err.message);
    }
}    
));

// Facebook Strategy
passport.use('facebookToken', new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        const existingUser = await User.findOne({ 'facebook.id': profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value
            }
        });
        await newUser.save();
        done(null, newUser);
    } catch (err) {
        done(err, false), err.message;
    }
}));

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ 'local.email': email });

        if (!user) {
            return done(null, false);
        }

        if (!user.authenticate(password)) {
            return done(null, false);
        }

        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));
