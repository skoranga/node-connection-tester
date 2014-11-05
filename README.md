connection-tester
=================

[![Build Status](https://travis-ci.org/skoranga/node-connection-tester.png)](https://travis-ci.org/skoranga/node-connection-tester)

Test to check if the connection can be established or host/port reachable for a given host and port. Useful for testing all the connection in your node application at server startup.


### How to Use

#### Async version

```javascript
var connectionTester = require('connection-tester');

connectionTester.test('www.yahoo.com', 80, function (err, output) {
    console.log(output);
});
connectionTester.test('api.paypal.com', 443, function (err, output) {
    console.log(output);
});
```

#### Sync version

```javascript
var connectionTester = require('connection-tester');

console.log(connectionTester.test('www.yahoo.com', 80));
console.log(connectionTester.test('api.paypal.com', 443));
```
