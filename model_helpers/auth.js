var async = require('async');
var db = require('../models');
var tokens = require('../util/tokens');
var _ = require('underscore');

var authHelper = {};

authHelper.create = function (userId, finalCallback) {
    async.waterfall([
        tokens.create,
        function (token, callback) {
            db.AuthTokens.create({
                userId: userId,
                token: token
            })
                .success(callback.bind(this, null))
                .error(callback);
        }
    ], finalCallback);
};

authHelper.find = function (token, finalCallback, options) {
    var options = options || {};

    var query = {
        where: {token: token}
    };

    if (options.query) _.extend(query, options.query);

    db.AuthTokens.find(query)
        .success(finalCallback.bind(this, null))
        .error(finalCallback);
};

authHelper.findForUser = function (userId, finalCallback, options) {
    var options = options || {};

    var query = {
        where: {userId: userId}
    };

    if (options.query) _.extend(query, options.query);

    db.AuthTokens.findAll(query)
        .success(finalCallback.bind(this, null))
        .error(finalCallback);
};

authHelper.delete = function (tokenQuery, finalCallback) {
    tokenQuery.destroy()
        .success(function () {
            return finalCallback(null);
        })
        .error(finalCallback);
};

module.exports = authHelper;