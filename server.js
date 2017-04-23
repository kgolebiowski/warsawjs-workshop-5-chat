'use strict'; // Używać w nodejs bo nie działa ES6; Nie pozwala na używanie niezadeklarowanych zmiennych itp

const io = require("socket.io")();

const CMD_LOGIN = '/login';

io.on('connection', (client) => {
    let name = client.id;
    console.log(`Client '${name}' joined chat!`);

    client.on('msg', data => {
        if (data.startsWith('/')) {
            if (data.startsWith(CMD_LOGIN)) {
                let localName = data.substring(CMD_LOGIN.length + 1, data.length);
                io.emit('broadcastMessage', `User '${name}' renamed to '${localName}'`);
                name = localName;
            } else {
                client.emit('broadcastMessage', `Unknown command '${data}'`);
            }
        } else
            io.emit('broadcastMessage', `${name} >>> ${data}`);
    });

    client.on('disconnect', function () {
        console.log(`Client '${name}' left the chat`);
    });
});

io.listen(4000);