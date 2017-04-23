'use strict';

const jwt = require("jwt-simple");
const secret = "testsecret";

module.exports = {
    generateJwt(chatClient) {
        const payload = {
            userName: chatClient.getUserName(),
            iat: new Date().getTime(),
            exp: Math.round((new Date().getTime() + 7200000) / 1000)
        };

        return jwt.encode(payload, secret);
    }
};