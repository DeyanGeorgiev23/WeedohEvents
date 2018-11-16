class Auth {
    static authenticateUser (token) {
        window.localStorage.setItem('JWT_TOKEN', token);
    }

    static isUserAuthenticated () {
        return window.localStorage.getItem('JWT_TOKEN') !== null;
    }

    static deauthenticateUser () {
        window.localStorage.removeItem('JWT_TOKEN');
        //window.location.reload(true);
    }

    static getToken () {
        return window.localStorage.getItem('JWT_TOKEN');
    }

}

export default Auth;