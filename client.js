'use strict';

const io = require('socket.io-client');
const socket = io('http://localhost:4000');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let token = "";

socket.on('loggedIn', data => {
    token = data;
});

socket.on('broadcastMessage', data => {
    consoleOut(data);
});

readline.on('line', line => {
    if(line === "/break") { // For debugging only !
        token = "asdf";
        return;
    }

    socket.emit('msg', {
        token: token,
        line: line
    });
});

readline.prompt();

function consoleOut(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    readline.prompt(true);
}