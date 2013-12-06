connection-tester
=================

Sync/Blocking test to check if the connection can be established or host/port reachable for a given host and port. Useful for testing all the connection in your node application at server startup.


### How to Use
```javascript
var connectionTester = require('connection-tester');

console.log(connectionTester.test('www.yahoo.com', 80));
console.log(connectionTester.test('api.paypal.com', 443));
```