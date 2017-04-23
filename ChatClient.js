const jwt = require('jwt-simple');
const secret = "testsecret";

class ChatClient {
    constructor(clientObj) {
        this.clientObj = clientObj;
        this.userName = clientObj.id;
        this.loggedIn = false;
    }

    setUserName(name) {
        this.userName = name;
    }

    getUserName() {
        return this.userName;
    }

    authenticate(name, password) {
        this.loggedIn = true;
        return password === "test";
    }

    validateToken(token) {
        jwt.decode(token, secret);

    }

    isLoggedIn() {
        return this.loggedIn;
    }
}

module.exports = ChatClient;