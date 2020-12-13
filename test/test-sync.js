'use strict';

var assert = require('assert'),
    net = require('net'),
    dnsSync = require('dns-sync'),
    connectionTester = require('../index');


describe('Connection tester - Sync', function () {
    var dummyServer,
        dummyServerPort = 9998;

    before(function (next) {
        dummyServer = net.createServer(function (c) {
            c.on('end', function () {});
        });
        dummyServer.listen(dummyServerPort, function () {
            next();
        });

    });

    after(function (next) {
        dummyServer.close();
        next();
    });

    it('should connect to localhost', function (next) {
        var connectOut = connectionTester.test('localhost', dummyServerPort);
        assert.ok(connectOut.error === null);
        assert.ok(connectOut.success === true);
        next();
    });

    it('should connect to www.google.com 443', function (next) {
        var connectOut = connectionTester.test('www.google.com', 443);
        assert.ok(connectOut.error === null);
        assert.ok(connectOut.success === true);

        connectOut = connectionTester.test(dnsSync.resolve('www.google.com'), 443);
        assert.ok(connectOut.error === null);
        assert.ok(connectOut.success === true);
        next();
    });

    it('should connect to www.yahoo.com 80', function (next) {
        var connectOut = connectionTester.test('www.yahoo.com', 80);
        assert.ok(connectOut.error === null);
        assert.ok(connectOut.success === true);
        next();
    });

    it('should return false while connecting to dead port on localhost', function (next) {
        var connectOut = connectionTester.test('localhost', 9999);
        assert.ok(connectOut.error.indexOf('connect ECONNREFUSED') !== -1);
        assert.ok(connectOut.success === false);
        next();
    });

    it('should return false while connecting to 5678 port on www.example.com', function (next) {
        var connectOut = connectionTester.test('www.example.com', 5678);
        assert.ok(connectOut.error === 'socket TIMEOUT');
        assert.ok(connectOut.success === false);
        next();
    });

    it('should return false for all these invalid cases', function (next) {
        var errorMsg = 'invalid host/port';
        assert.ok(connectionTester.test('helloworld.', 'hello').error === errorMsg);
        assert.ok(connectionTester.test('www.example.com', 'hello').error === errorMsg);
        assert.ok(connectionTester.test('www.example.com', -1).error === errorMsg);
        assert.ok(connectionTester.test('www.example.com', 65536).error === errorMsg);
        assert.ok(connectionTester.test('www.example.com', 9999999).error === errorMsg);
        assert.ok(connectionTester.test('www.example.com', '& touch 222').error === errorMsg);
        assert.ok(connectionTester.test('& touch 111', '& touch 222').error === errorMsg);
        assert.ok(connectionTester.test('& touch 111', 80).error === errorMsg);
        assert.ok(connectionTester.test('www.test', 80).error);
        next();
    });

});
