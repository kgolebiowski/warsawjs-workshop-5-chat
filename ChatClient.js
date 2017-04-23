class ChatClient {
    constructor(clientObj) {
        this.clientObj = clientObj;
        this.userName = clientObj.id;
    }

    setUserName(name) {
        this.userName = name;
    }

    getUserName() {
        return this.userName;
    }
}

module.exports = ChatClient;