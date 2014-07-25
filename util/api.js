var error = require('tea-error');

var api = {};

api.APIError = error('APIError');

api.APIParam = function (name) {
    var self = this;

    self.name = name;
    self.value = undefined;

    self.define = function (value) {
        self.value = value;
    };
    self.fromRequest = function (req, name) {
        var lookupName = name || self.name;
        self.value = req.param(lookupName);
    };

    self.errors = {};

    self.errors.missing = function () {
        return new api.APIError('Missing Parameter: ' + self.name);
    };

    self.errors.invalid = function () {
        return new api.APIError('Invalid Parameter: ' + self.name);
    };

    self.validate = function (fn, callback, params) {
        var params = params || [self.value];
        if (!fn.apply(this, params)) {
            return callback(self.errors.invalid());
        }
        return callback(null);
    };
};

module.exports = api;