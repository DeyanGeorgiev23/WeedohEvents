const userController = require('./user-controller');
const authController = require('./auth-controller');
const friendsController = require('./friends-controller');
const eventController = require('./event-controller');

module.exports = {
    user: userController,
    auth: authController,
    friends: friendsController,
    event: eventController
};