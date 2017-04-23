'use strict'; // Używać w nodejs bo nie działa ES6; Nie pozwala na używanie niezadeklarowanych zmiennych itp

const io = require("socket.io")();
const ChatClient = require("./ChatClient");

const CMD_LOGIN = '/login';
const CMD_USERS = '/list';

let clients = [];

io.on('connection', (client) => {
    let chatClient = new ChatClient(client);
    let clientIndex = clients.push(chatClient)-1;
    io.emit('broadcastMessage', `** Client '${clients[clientIndex].getUserName()}' joined chat!`);

    client.on('msg', data => {
        if (data.startsWith('/')) {
            if (data.startsWith(CMD_LOGIN)) {
                let newName = data.substring(CMD_LOGIN.length + 1, data.length);
                io.emit('broadcastMessage', `User '${clients[clientIndex].getUserName()}' renamed to '${newName}'`);
                clients[clientIndex].setUserName(newName);
            } else if(data.startsWith(CMD_USERS)) {
                io.emit('broadcastMessage', '** Users: ');
                for(let user of clients) {
                    io.emit('broadcastMessage', `- ${user.getUserName()}`);
                }
            } else {
                client.emit('broadcastMessage', `Unknown command '${data}'`);
            }
        } else
            io.emit('broadcastMessage', `${clients[clientIndex].getUserName()} >>> ${data}`);
    });

    client.on('disconnect', function () {
        io.emit('broadcastMessage', `Client '${clients[clientIndex].getUserName()}' has left the chat`);
        clients.splice(clientIndex, 1);
    });
});

io.listen(4000);