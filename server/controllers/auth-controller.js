const emailValidator = require('email-validator');
const encryption = require('../utilities/encryption');
const User = require('../models/User');
const JWT = require('jsonwebtoken');
const config = require('../config/config');

signToken = (user) => {
    return JWT.sign({
        iss: 'RD',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setTime(new Date().getTime() + 1)
    }, config.JWTsecret);
};

module.exports = {
    signUp: async (req, res) => {
        const user = req.body;

        if (!emailValidator.validate(user.email)) {
            return res.status(403).json({ error: 'Please add a valid email!' });
        }

        if (!user.username) {
            return res.status(403).json({ error: 'Username is required!' });
        }

        if (user.password.length < 6 && user.password.length > 20) {
            return res.status(403).json({ error: 'Password must be between 6 and 20 characters!' });
        }

        if (user.password && user.password !== user.confirmedPassword) {
            return res.status(403).json({ error: 'Password does not match!' });
        }

        const salt = encryption.generateSalt();
        user.salt = salt;

        if (user.password) {
            const hashedPass = encryption.generateHashedPassword(salt, user.password);
            user.password = hashedPass;
        }

        const foundUser = await User.findOne({ 'local.email': user.email });
        if (foundUser) {
            return res.status(403).json({ error: 'E-mail is already taken!' });
        }

        try {
            const newUser = new User({ 
                method: 'local',
                local: {
                    email: user.email, 
                    username: user.username,
                    password: user.password,
                    salt: user.salt
                }
            });
            await newUser.save();
    
            const token = signToken(newUser);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },
    signIn: async (req, res) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    googleOAuth: async (req, res) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    facebookOAuth: async (req, res) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    }
};