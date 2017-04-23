'use strict';

const io = require('socket.io-client');
const socket = io('http://localhost:4000');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('What is your name? ', (answer) => {
    socket.emit('msg', {
        cmd: "name",
        data: answer
    });
});

socket.on('broadcastMessage', data => {
    console.log(`${data}`);
});

readline.on('line', line => {
    socket.emit('msg', {
        cmd: "msg",
        data: line
    });
});

readline.prompt();