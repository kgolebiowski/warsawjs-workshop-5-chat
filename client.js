'use strict';

const io = require('socket.io-client');
const socket = io('http://localhost:4000');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('broadcastMessage', data => {
    console.log(`${data}`);
});

readline.on('line', line => {
    socket.emit('msg', line);
});

readline.prompt();