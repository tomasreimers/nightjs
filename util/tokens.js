var crypto = require('crypto');

var tokens = {};

tokens.create = function (callback) {
    crypto.randomBytes(20, function(ex, buf) {
        if (ex) {
            return callback(ex);
        }
        var token = buf.toString('hex');
        return callback(null, token);
    });
};

module.exports = tokens;