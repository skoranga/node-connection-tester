'use strict';

var util = require('util'),
    path = require('path'),
    shell = require('shelljs');

exports = module.exports = {
    test: function ConnectionTester(host, port) {
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
};

