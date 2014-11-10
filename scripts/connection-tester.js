'use strict';

var net = require('net');

var socket = new net.Socket(),
    host = process.argv[2],
    port = process.argv[3];

var SOCKET_TIMEOUT = 500;   //Setting 500ms as max acceptable timeout

socket.connect(port, host);
socket.setTimeout(SOCKET_TIMEOUT);

//if able to establish the connection, returns `true`
socket.on('connect', function () {
    socket.destroy();
    process.stdout.write(true);
});

//on connection error, returns error
socket.on('error', function (err) {
    socket.destroy();
    process.stdout.write(err);
});

//on connection timeout, returns error
socket.on('timeout', function (err) {
    socket.destroy();
    process.stdout.write('socket TIMEOUT');
});