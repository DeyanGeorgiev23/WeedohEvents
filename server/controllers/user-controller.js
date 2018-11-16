const User = require('../models/User');
const Archive = require('../models/Archive');
const CalendarEvent = require('../models/CalendarEvent');
const encryption = require('../utilities/encryption');
const sendMail = require('../utilities/mailSender');
const checkMethod = require('../utilities/checkMethod');
const UserData = require('../utilities/UserData');
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
    profile: async (req, res) => {
        const currentUserId = req.user.id;

        try {
            let currentUser = await User.findById(currentUserId);

            let user = checkMethod(currentUser, UserData);

            res.status(200).json({ user });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    
    },
    deleteProfile: async (req, res) => {
        let currentUserId = req.user.id;

        try {
            let user = await User.findById(currentUserId);

            let events = await CalendarEvent
                .find()
                .where('creator')
                .equals(user.id);

            for (let event of events) {
                await CalendarEvent.findByIdAndDelete(event);
            }

            let allEvents = await CalendarEvent.find();

            for (let event of allEvents) {
                if (event.participants.toString().includes(user.id)) {
                    let index = event.participants.indexOf(user.id);
                    event.participants.splice(index, 1);
                }
            }

            await User.findByIdAndDelete(currentUserId);

            res.status(200).json({ successMessage: 'Profile was deleted successfully!' });
        } catch (error) {
            res.status(404).json({ error: error });
        }
    },
    changePass: async (req, res) => {
        let currentUserId = req.user.id;
        let { key, newPassword, confirmedNewPassword } = req.body;

        if (!key || !newPassword || !confirmedNewPassword) {
            return res.status(200).json({ errorMessage: 'Please send valid data!' });
        }

        try {
            let archive = await Archive.findOne({ id: currentUserId });

            if (!archive.authenticateKey(key.toString())) {
                return res.status(200).json({ errorMessage: 'Invalid key!' });
            }

            if (newPassword.length < 6 && newPassword.length > 20) {
                return res.status(200).json({ errorMessage: 'Password must be between 6 and 20 characters!' });
            }

            if (newPassword !== confirmedNewPassword) {
                return res.status(200).json({ errorMessage: 'Password does not match!' });
            }

            let currentUser = await User.findById(currentUserId);


            let salt = encryption.generateSalt();
            const hashedPass = encryption.generateHashedPassword(salt, newPassword);
            
            currentUser.local.salt = salt;
            await currentUser.save();

            currentUser.local.password = hashedPass;
            await currentUser.save();

            await Archive.findOneAndDelete({ id: currentUserId });

            res.status(200).json({ successMessage: 'Password successfully changed!' });

        } catch (error) {
            res.status(404).json({ error: error });
        }
    },
    changeData: async (req, res) => {
        let currentUserId = req.user.id;
        let { newUsername, newEmail } = req.body;

        if (!newUsername && !newEmail) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }

        try {
            let currentUser = await User.findById(currentUserId);

            if (currentUser.method !== 'local') {
                return res.status(200).json({ errorMessage: 'You can not change you username because your login method is by Facebook of Google!' });
            }

            if (newUsername) { currentUser.local.username = newUsername; };
            if (newEmail) { currentUser.local.email = newEmail; }

            await currentUser.save();

            res.status(200).json({ successMessage: 'Username changed successfully!' });
        } catch (error) {
            res.status(404).json({ error: error });
        }
    },
    getKey: async (req, res) => {
        let currentUserId = req.user.id;
        let key = Math.round(Math.random() * 1000000);

        try {
            let oldArchive = await Archive.findOne({ id: currentUserId });

            if (oldArchive) {
                await Archive.findOneAndDelete({ id: currentUserId });
            }

            let salt = encryption.generateSalt();
            let hashedKey = encryption.generateHashedPassword(salt, key.toString());

            let newArchive = new Archive({
                id: currentUserId,
                key: hashedKey,
                salt: salt
            });
            
            await newArchive.save();

            let currentUser = await User.findById(currentUserId);

            if (currentUser.method !== 'local') {
                let loginMethod = currentUser.method;

                return res.status(200).json({ errorMessage: `You are logged with ${loginMethod.toUpperCase()}.You are not able to change your password!` });
            }

            let userEmail = currentUser.local.email;
            let username = currentUser.local.username;

            let timer = setTimeout(async () => {
                try {
                    await Archive.findOneAndDelete({ id: currentUserId });
                    return clearTimeout(timer);
                } catch (error) {
                    throw new Error(error);
                }
            }, 900000);

            let html = `Hello ${username}!This is your secret key ${key.toString()}, be alert the key is valid only for 15 minutes!`;

            sendMail(userEmail, 'Secret Key', html, res);

        } catch (error) {
            res.status(200).json({ error: error });
        }
    },
    forgotPassword: async (req, res) => {
        let { email } = req.body;
        let key = Math.round(Math.random() * 1000000);

        if (!email) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }

        try {
            let user = await User.findOne({ 'local.email': email });

            const token = signToken(user);
            if (!user) {
                return res.status(200).json({ errorMessage: 'No user with this email!' });
            }

            let oldArchive = await Archive.findOne({ id: user.id });

            if (oldArchive) {
                await Archive.findOneAndDelete({ id: user.id });
            }

            let salt = encryption.generateSalt();
            let hashedKey = encryption.generateHashedPassword(salt, key.toString());

            let newArchive = new Archive({
                id: user.id,
                key: hashedKey,
                salt: salt
            });
            
            await newArchive.save();

            let timer = setTimeout(async () => {
                try {
                    await Archive.findOneAndDelete({ id: user.id });
                    return clearTimeout(timer);
                } catch (error) {
                    throw new Error(error);
                }
            }, 900000);

            sendMail(email, 'Secret Key', `WeedohEvents secret key: ${key.toString()}, valid for 15 min!`);

            res.status(200).json({ successMessage: `The secret key was send to ${email}`, token });

        } catch (error) {
            res.status(404).json({ error: error });
        }
    }
};