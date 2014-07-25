var async = require('async');
var db = require('../models');

var userHelper = {};

userHelper.create = function (email, finalCallback) {
    db.Users.create({
        email: email
    })
        .success(finalCallback.bind(this, null))
        .error(finalCallback);
};

userHelper.find = function (email, finalCallback, options) {
    var options = options || {};

    var query = {
        where: {email: email}
    };

    if (options.query) _.extend(query, options.query);

    db.Users.find(query)
        .success(finalCallback.bind(this, null))
        .error(finalCallback);
};

module.exports = userHelper;