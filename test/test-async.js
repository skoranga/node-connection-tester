'use strict';

var assert = require('assert'),
    net = require('net'),
    dnsSync = require('dns-sync'),
    connectionTester = require('../index');


describe('Connection tester - Async', function () {
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
        connectionTester.test('localhost', dummyServerPort, function (err, connectOut) {
            assert.ok(connectOut.error === null);
            assert.ok(connectOut.success === true);
            next();
        });
    });

    it('should connect to www.google.com 443', function (next) {
        connectionTester.test('www.google.com', 443, function (err, connectOut) {
            assert.ok(connectOut.error === null);
            assert.ok(connectOut.success === true);
            next();
        });
    });

    it('should connect to www.google.com\'s IP 443', function (next) {
        connectionTester.test(dnsSync.resolve('www.google.com'), 443, function (err, connectOut) {
            assert.ok(connectOut.error === null);
            assert.ok(connectOut.success === true);
            next();
        });
    });

    it('should connect to www.yahoo.com 80', function (next) {
        connectionTester.test('www.yahoo.com', 80, function (err, connectOut) {
            assert.ok(connectOut.error === null);
            assert.ok(connectOut.success === true);
            next();
        });
    });

    it('should return false while connecting to dead port on localhost', function (next) {
        connectionTester.test('localhost', 9999, 1000, function (err, connectOut) {
            assert.ok(connectOut.error.indexOf('connect ECONNREFUSED') !== -1);
            assert.ok(connectOut.success === false);
            next();
        });
    });

    it('should return false while connecting to 5678 port on www.example.com', function (next) {
        connectionTester.test('www.example.com', 5678, 1000, function (err, connectOut) {
            console.log(connectOut);
            assert.ok(connectOut.error === 'socket TIMEOUT');
            assert.ok(connectOut.success === false);
            next();
        });
    });

    it('should return false for invalid host and port', function (next) {
        connectionTester.test('& touch 111', '& touch 222', 1000, function (err, connectOut) {
            console.log(connectOut);
            assert.ok(connectOut.error);
            assert.ok(connectOut.success === false);
            next();
        });
    });

});
