'use strict';

var net = require('net'),
    util = require('util'),
    path = require('path'),
    shell = require('shelljs');

var SOCKET_TIMEOUT = 1000;   //Setting 1s as max acceptable timeout

function testSync(host, port) {
    var output,
        nodeBinary = process.execPath,
        scriptPath = path.join(__dirname, "./scripts/connection-tester"),
        cmd = util.format('"%s" "%s" %s %s', nodeBinary, scriptPath, host, port);

    var shellOut = shell.exec(cmd, {silent: true});

    output = {
        success: false,
        error: null
    };
    if (shellOut && shellOut.code === 0) {
        if (shellOut.output === 'true') {
            output.success = true;
        } else {
            output.error = shellOut.output;
        }
    }
    return output;
}

function testAsync(host, port, callback) {
    var socket = new net.Socket();

    var output = {
        success: false,
        error: null
    };

    socket.connect(port, host);
    socket.setTimeout(SOCKET_TIMEOUT);

    //if able to establish the connection, returns `true`
    socket.on('connect', function () {
        socket.destroy();
        output.success = true;
        return callback(null, output);
    });

    //on connection error, returns error
    socket.on('error', function (err) {
        socket.destroy();
        output.error = err && err.message || err;
        return callback(err, output);
    });

    //on connection timeout, returns error
    socket.on('timeout', function (err) {
        socket.destroy();
        output.error = err && err.message || err || 'socket TIMEOUT';
        return callback(err, output);
    });
}

exports = module.exports = {
    test: function ConnectionTester(host, port, callback) {
        if (callback) {
            return testAsync(host, port, callback);
        } else {
            return testSync(host, port);
        }
    }
};

