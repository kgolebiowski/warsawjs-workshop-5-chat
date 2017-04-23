'use strict';

const io = require("socket.io")();

const ChatClient = require("./ChatClient");

const tokenGenerator = require("./tokenGenerator");

const CMD_LOGIN = '/login';
const CMD_USERS = '/list';
const CMD_KICK = '/kick';
const CMD_DISCONNECT = '/disco';

let clients = [];

io.on('connection', (client) => {
    let chatClient = new ChatClient(client);
    let clientIndex = clients.push(chatClient) - 1;
    io.emit('broadcastMessage', `** Client '${clients[clientIndex].getUserName()}' joined chat!`);

    client.on('msg', data => {
        try {
            if(data.token !== "") {
                console.log(`Validating token for user '${clients[clientIndex].getUserName()}'`);
                clients[clientIndex].validateToken(data.token);
            } else
                console.log(`Skipping token validation for user '${clients[clientIndex].getUserName()}'`);

            if (data.line.startsWith('/')) {
                if (data.line.startsWith(CMD_LOGIN)) {
                    let loginData = data.line.substring(CMD_LOGIN.length + 1, data.line.length).split(" ");
                    if (clients[clientIndex].authenticate(loginData[0], loginData[1])) {
                        io.emit('broadcastMessage', `** User '${clients[clientIndex].getUserName()}' renamed to '${loginData[0]}'`);
                        clients[clientIndex].setUserName(loginData[0]);
                        client.emit('loggedIn', tokenGenerator.generateJwt(chatClient));
                    } else
                        client.emit('broadcastMessage', `** Wrong password!`);
                } else if (data.line.startsWith(CMD_DISCONNECT)) {
                    client.disconnect(true);
                } else if (data.line.startsWith(CMD_USERS) && clients[clientIndex].isLoggedIn()) {
                    io.emit('broadcastMessage', '** Users: ');
                    for (let user of clients) {
                        io.emit('broadcastMessage', `- ${user.getUserName()}`);
                    }
                } else if (data.line.startsWith(CMD_KICK) && clients[clientIndex].isLoggedIn()) {
                    let userName = data.line.substring(CMD_KICK.length + 1, data.line.length);
                    let found = clients.find(function (fClient) {
                        return fClient.getUserName() === userName;
                    });

                    if (found !== undefined) {
                        io.emit('broadcastMessage', `** User '${found.getUserName()}' has been kicked by '${clients[clientIndex].getUserName()}'`);
                        found.getClient().disconnect(true);
                    } else
                        client.emit('broadcastMessage', `** User '${data.line}' is not online...`);
                } else {
                    client.emit('broadcastMessage', `Unknown command '${data.line}' or user not permitted...'`);
                }
            } else {
                const prefix = clients[clientIndex].isLoggedIn() ? "logged" : "anonym";
                io.emit('broadcastMessage', `${clients[clientIndex].getUserName()} (${prefix}) > ${data.line}`);
            }
        } catch (ex) {
            console.log(`Client ${clients[clientIndex].getUserName()} is doing something nasty, disconnecting...`);
            clients[clientIndex].getClient().disconnect();
        }
    });

    client.on('disconnect', function () {
        io.emit('broadcastMessage', `Client '${clients[clientIndex].getUserName()}' has left the chat`);
        clients.splice(clientIndex, 1);
    });
});

io.listen(4000);