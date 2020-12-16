'use strict';

const net = require('net');
const util = require('util');
const path = require('path');
const shell = require('child_process');

let SOCKET_TIMEOUT = 1000;   //Setting 1s as max acceptable timeout

//source - http://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
var ValidHostnameRegex = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");

function isValidHostNameOrIP(host) {
    return net.isIP(host) || ValidHostnameRegex.test(host);
}

function testSync(host, port, connectTimeout) {
    const nodeBinary = process.execPath;
    const scriptPath = path.join(__dirname, "./scripts/connection-tester");
    const cmd = util.format('"%s" "%s" %s %s %s', nodeBinary, scriptPath, host, port, connectTimeout);

    const shellOut = shell.execSync(cmd).toString();

    const output = {
        success: false,
        error: null
    };

    if (shellOut) {
      if (shellOut.match(/true/)) {
        output.success = true;
      } else {
        output.error = shellOut;
      }
    } else {
        output.error = "No output from connection test";
    }
    return output;
}

function testAsync(host, port, connectTimeout, callback) {
    const socket = new net.Socket();

    const output = {
        success: false,
        error: null
    };

    socket.connect(port, host);
    socket.setTimeout(connectTimeout);

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

module.exports = {

    timeout: function (socketTimeout) {

        if (!!socketTimeout) {
            SOCKET_TIMEOUT = socketTimeout;
        }

        return SOCKET_TIMEOUT;

    },
    test: function ConnectionTester(host, port, connectTimeout, callback) {

        // validate host
        if (!isValidHostNameOrIP(host)) {
            console.error('[connection-tester] invalid host: ', host);
            host = undefined;
        }
        // validate port
        var originalPort = port;
        port = +port;
        if (!port || port < 0 || port > 65535) {
            console.error('[connection-tester] invalid port: ', originalPort);
            port = undefined;
        }

        if (typeof connectTimeout === 'function') {
            console.error('deprecated: Please migrate to the new interface ConnectionTester\(host, port, timeout, callback\)');
            callback = connectTimeout;
            connectTimeout = SOCKET_TIMEOUT;
        }
        if (connectTimeout === undefined) {
            connectTimeout = SOCKET_TIMEOUT;
        }

        if (typeof connectTimeout === 'number') {
            if (!port || !host) {
                var output = {
                    success: false,
                    error: 'invalid host/port'
                };

                if (callback) {
                    return callback(null, output);
                } else {
                    return output;
                }
            }
            if (callback) {
                return testAsync(host, port, connectTimeout, callback);
            } else {
                return testSync(host, port, connectTimeout);
            }
        }
    }
};
