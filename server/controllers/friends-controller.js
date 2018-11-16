const checkMethod = require('../utilities/checkMethod');
const User = require('../models/User');
const UserData = require('../utilities/UserData');

module.exports = {
    findFriends: async (req, res) => {
        const currentUserId = req.user.id;
        const { limit } = req.body;

        if (!limit) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }
 
        try {
            let allData = await User.find();

            let allDataLength = allData.length;

            let currentUser = await User
                .findById(currentUserId)
                .populate('requestSend')
                .populate('friends')
                .populate('requestGet');

            let usersData = await User.find().limit(limit);

            let warningMessage;

            if (allDataLength - limit <= 10) {
                warningMessage = true;
            }

            if (usersData.length % 10 !== 0) {
                return res.status(200).json({ errorMessage: 'No more data!' });
            }
            usersData = usersData.filter(u => u.id !== currentUserId);
 
            for (let i = 0; i < currentUser.friends.length; i++) {
                usersData = usersData.filter(u => u.id !== currentUser.friends[i].id);
            }
 
            for (let i = 0; i < currentUser.requestSend.length; i++) {
                usersData = usersData.filter(u => u.id !== currentUser.requestSend[i].id);
            }

            for (let i = 0; i < currentUser.requestGet.length; i++) {
                usersData = usersData.filter(u => u.id !== currentUser.requestGet[i].id);
            }
 
            let users = [];
            for (let user of usersData) {
                users.push(checkMethod(user, UserData));
            }

            let yourSendedReq = [];
 
            for (let user of currentUser.requestSend) {
                yourSendedReq.push(checkMethod(user, UserData));
            }
 
            if (warningMessage) {
                return res.status(200).json({ users, yourSendedReq, warningMessage });
            }

            res.status(200).json({ users, yourSendedReq });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    requestSend: async (req, res) => {
        let otherUsers = req.body.id;
        let currentUserId = req.user.id;

        if (!otherUsers) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }

        try {
            let user = await User.findById(otherUsers);
            let currentUser = await User.findById(currentUserId);

            if (user.requestGet.toString().indexOf(currentUserId) === -1) {
                user.requestGet.push(currentUserId);
                await user.save();

                currentUser.requestSend.push(otherUsers);
                await currentUser.save();
 
                return res.status(200).json({ message: 'Request was send successfully!' });
            }
 
            res.status(403).json({ message: 'You already send a request to this person!' });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    requestGet: async (req, res) => {
        const currentUserId = req.user.id;
        let usersRequests = [];
        
        try {
            let currentUser = await User.findById(currentUserId).populate('requestGet');
            
            for (let user of currentUser.requestGet) {
                usersRequests.push(checkMethod(user, UserData));
            }

            res.status(200).json({ usersRequests });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    requestAnswer: async (req, res) => {
        let currentUserId = req.user.id;
        let { otherUserId, answer } = req.body;

        if (!otherUserId || !answer) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }

        if (answer === 'yes') {
            try {
                let currentUser = await User.findById(currentUserId);
                currentUser.friends.push(otherUserId);
                let currentUserIndex = currentUser.requestGet.indexOf(otherUserId);
                currentUser.requestGet.splice(currentUserIndex, 1);
                let currentUserIndex2 = currentUser.requestSend.indexOf(otherUserId);
                currentUser.requestSend.splice(currentUserIndex2, 1);
                await currentUser.save();

                let otherUser = await User.findById(otherUserId);
                otherUser.friends.push(currentUserId);
                let otherUserIndex = currentUser.requestSend.indexOf(currentUserId);
                otherUser.requestSend.splice(otherUserIndex, 1);
                let otherUserIndex2 = currentUser.requestGet.indexOf(currentUserId);
                otherUser.requestGet.splice(otherUserIndex2, 1);
                await otherUser.save();

                res.status(200).json({ message: 'Request successfully accept!' });
            } catch (error) {
                res.status(403).json({ error: error });
            }
        } else if (answer === 'no') {
            try {
                let currentUser = await User.findById(currentUserId);
                let index = currentUser.requestGet.indexOf(otherUserId);
                currentUser.requestGet.splice(index, 1);
                let index2 = currentUser.requestSend.indexOf(otherUserId);
                currentUser.requestSend.splice(index2, 1);

                await currentUser.save();

                let otherUser = await User.findById(otherUserId);
                let index3 = otherUser.requestGet.indexOf(currentUserId);
                otherUser.requestGet.splice(index3, 1);
                let index4 = otherUser.requestSend.indexOf(currentUserId);
                otherUser.requestSend.splice(index4, 1);

                await otherUser.save();
                
                res.status(200).json({ message: 'Request successfully refused' });
            } catch (error) {
                res.status(403).json({ error: error });
            }
        }
    },
    yourFriends: async (req, res) => {
        const currentUserId = req.user.id;
        let friends = [];

        try {
            let currentUser = await User
                .findById(currentUserId)
                .populate('friends');

            for (let user of currentUser.friends) {
                friends.push(checkMethod(user, UserData));
            }

            res.status(200).json({ friends });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    remove: async (req, res) => {
        let currentUserId = req.user.id;
        let otherUserId = req.body.id;

        if (!otherUserId) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        } 
 
        try {
            let currentUser = await User.findById(currentUserId);
            let otherUser = await User.findById(otherUserId);
 
            let currentUserIndex = currentUser.friends.indexOf(otherUserId);
            currentUser.friends.splice(currentUserIndex, 1);
            await currentUser.save();
 
            let otherUserIndex = otherUser.friends.indexOf(currentUserId);
            otherUser.friends.splice(otherUserIndex, 1);
            await otherUser.save();
 
            res.status(200).json({ message: 'Your friend was removed successfully!' });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    search: async (req, res) => {
        let name = req.query.text;
        let users = [];

        if (!name) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }

        try {
            let userData = await User.find();

            for (let user of userData) {
                users.push(checkMethod(user, UserData));
            }

            users = users.filter(u => u.username.toLowerCase().includes(name.toLowerCase()));

            res.status(200).json({ users });
        } catch (error) {
            res.status(404).json({ error: error });
        }
    }
};