function checkMethod(user, UserData) {
    let users = '';
    if (user.method === 'local') {
        users = new UserData(user.id, user.local.email, user.local.username);
    } else if (user.method === 'google') {
        users = new UserData(user.id, user.google.email, user.google.username);
    } else if (user.method === 'facebook') {
        users = new UserData(user.id, user.facebook.email, user.facebook.username);
    }

    return users;
};

module.exports = checkMethod;
