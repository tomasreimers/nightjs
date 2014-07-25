var db = require('../models');
var api = require('../util/api');
var tokens = require('../util/tokens');
var async = require('async');
var express = require('express');
var _ = require('underscore');
var validator = require('validator');
var passwordHash = require('password-hash');
var authHelper = require('../model_helpers/auth.js');
var usersHelper = require('../model_helpers/users.js');

var router = express.Router();

router.get('/auths', function(req, res, next) {
    var token = new api.APIParam('token');

    token.fromRequest(req);

    var tokenResult;
    var userId;

    async.waterfall([
        function (callback) { authHelper.find(token.value, callback); },
        function (tokenQuery, callback) {
            tokenResult = tokenQuery;
            callback(null);
        },
        function (callback) { email.validate(_.not(_.isNull), callback, [tokenResult]); },
        function (callback) {
            userId = tokenResult.values.userId;
            callback(null);
        },
        function (callback) {
            authHelper.findForUser(userId, callback, {
                query: {
                    attributes: ['token', 'createdAt']
                }
            });
        },
        function (tokens, callback) {
            res.json(tokens)
            return callback(null);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        }
    });
});

router.get('/auth/:token', function(req, res, next) {
    var token = new api.APIParam('token');

    token.fromRequest(req);

    var response;

    async.waterfall([
        function (callback) {
            authHelper.find(token.value, callback, {
                query: {
                    include: [{ model: db.Users, attributes: ['id', 'email'] }]
                }
            });
        },
        function (token, callback) {
            var response = {
                valid: (!_.isNull(token))
            };
            if (response.valid) {
                response.user = token.user;
            }

            res.json(response);
            return callback(null);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        }
    });
});

router.post('/auth', function(req, res, next) {
    var email = new api.APIParam('email');
    var password = new api.APIParam('password');

    email.fromRequest(req);
    password.fromRequest(req);

    var user;

    async.waterfall([
        function (callback) { email.validate(validator.isEmail, callback); },
        function (callback) { usersHelper.find(email.value, callback); },
        function (userQuery, callback) {
            user = userQuery;
            callback(null);
        },
        function (callback) { email.validate(_.not(_.isNull), callback, [user]); },
        function (callback) { password.validate(passwordHash.verify, callback, [password.value, user.values.password]); },
        function (callback) { authHelper.create(user.values.id, callback); },
        function (token, callback) {
            res.json({
                token: token
            });
            callback(null);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        }
    });
});

router.delete('/auth/:token', function(req, res, next) {
    var token = new api.APIParam('token');

    token.fromRequest(req);

    var tokenResult;

    async.waterfall([
        function (callback) { authHelper.find(token.value, callback); },
        function (tokenResponse, callback) {
            tokenResult = tokenResponse;
            callback(null);
        },
        function (callback) { email.validate(_.not(_.isNull), callback, [tokenResult]); },
        function (callback) { authHelper.delete(tokenResult, callback); },
        function (callback) {
            res.json({success: "true"});
            callback(null);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        }
    });
});

module.exports = router;