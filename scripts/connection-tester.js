'use strict';

var util = require('util'),
    net = require('net');

var socket = new net.Socket(),
    host = process.argv[2],
    port = process.argv[3];

socket.connect(port, host);
socket.setTimeout(1000);    //Setting 1s as max acceptable timeout

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
    process.stdout.write(err);
});