const controllers = require('../controllers');
const passport = require('passport');
require('../config/passport');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportFacebook = passport.authenticate('facebookToken', { session: false });

module.exports = (app) => {
    // Authentications
    app.post('/api/auth/signup', controllers.auth.signUp);
    app.post('/api/auth/signin', passportSignIn, controllers.auth.signIn);
    app.post('/api/auth/google', passportGoogle, controllers.auth.googleOAuth);
    app.post('/api/auth/facebook', passportFacebook, controllers.auth.facebookOAuth);

    // All about users friends 
    app.post('/api/user/friends/find', passportJWT, controllers.friends.findFriends);
    app.post('/api/user/request/send', passportJWT, controllers.friends.requestSend);
    app.get('/api/user/request/get', passportJWT, controllers.friends.requestGet);
    app.post('/api/user/request/answer', passportJWT, controllers.friends.requestAnswer);
    app.get('/api/user/friends/yourFriends', passportJWT, controllers.friends.yourFriends);
    app.post('/api/user/friends/remove', passportJWT, controllers.friends.remove);
    app.get('/api/user/friends/search', passportJWT, controllers.friends.search);

    // All about user
    app.get('/api/user/profile', passportJWT, controllers.user.profile);
    app.get('/api/user/delete', passportJWT, controllers.user.deleteProfile);
    app.get('/api/user/secret/key', passportJWT, controllers.user.getKey);
    app.post('/api/user/changePass', passportJWT, controllers.user.changePass);
    app.post('/api/user/forgotPass', controllers.user.forgotPassword);
    app.post('/api/user/change/data', passportJWT, controllers.user.changeData);

    // All about Events
    app.post('/api/event/create', passportJWT, controllers.event.create);
    app.post('/api/event/edit', passportJWT, controllers.event.editEvent);
    app.post('/api/event/getEvents', controllers.event.getEvents);
    app.get('/api/event/allEvents', passportJWT, controllers.event.allEvents);
    app.get('/api/event/invites', passportJWT, controllers.event.invitesEvents);
    app.post('/api/event/invites/answer', passportJWT, controllers.event.invitesAnswer);
    app.post('/api/event/join', passportJWT, controllers.event.joinEvent);
    app.post('/api/event/leave', passportJWT, controllers.event.leaveEvent);
    app.post('/api/event/delete', passportJWT, controllers.event.delete);

    app.get('*', (req, res) => {
        res.status(404).json({ message: 'Not found!' });
    });
};