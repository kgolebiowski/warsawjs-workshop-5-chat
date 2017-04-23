'use strict'; // Używać w nodejs bo nie działa ES6; Nie pozwala na używanie niezadeklarowanych zmiennych itp

const io = require("socket.io")();

io.on('connection', (client) => {
    let name = "";

    client.on('msg', data => {
        if (data.cmd === "name") {
            name = data.data;
            console.log(`Client '${name}' joined chat!`);
        }
        else {
            io.emit('broadcastMessage', `${name} (${client.id}) >>> ${data.data}`);
        }
    });

    client.on('disconnect', function () {
        console.log(`Client '${name}' left the chat`);
    });
});

io.listen(4000);