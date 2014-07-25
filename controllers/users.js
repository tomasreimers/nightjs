var config = {};

var db = require('../models');
var api = require('../util/api');
var tokens = require('../util/tokens');
config.auth = require('../config/auth');
var async = require('async');
var express = require('express');
var _ = require('underscore');
var validator = require('validator');
var passwordHash = require('password-hash');
var authHelper = require('../model_helpers/auth.js');
var usersHelper = require('../model_helpers/users.js');

var router = express.Router();

router.get('/users', function(req, res, next) {
    // @TODO
});

router.get('/user/:id', function(req, res, next) {
    // @TODO
});

router.post('/user', function(req, res, next) {
    var email = new api.APIParam('email');

    email.fromRequest(req);

    var userResult;
    var newUser;

    async.waterfall([
        function (callback) { email.validate(validator.isEmail, callback); },
        function (callback) { usersHelper.find(email.value, callback); },
        function (userQuery, callback) {
            userResult = userQuery;
            callback(null);
        },
        function (callback) { email.validate(_.isNull, callback, [userResult]); },
        function (callback) { usersHelper.create(email.value, callback); },
        function (newUserResult, callback) {
            newUser = newUserResult;
            callback(null);
        },
        function (callback) { authHelper.create(newUser.values.id, callback); },
        function (token, callback) {
            res.json({
                authToken: token
            });

            callback(null);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        }
    });
});

router.put('/user/:id/password', function(req, res, next) {
    var id = new api.APIParam('id');
    var password = new api.APIParam('password');
    var token = new api.APIParam('token');

    id.fromRequest(req);
    password.fromRequest(req);
    token.fromRequest(req);

    var tokenResult;

    async.waterfall([
        function (callback) { password.validate(validator.isLength, callback, [password.value, config.auth.minPasswordLength]); },
        function (callback) { authHelper.find(token.value, callback, {
            query: {
                include: db.Users
            }
        }); },
        function (tokenQuery, callback) {
            tokenResult = tokenQuery;
            callback(null);
        },
        function (callback) { token.validate(_.not(_.isNull), callback, [tokenResult]); },
        function (callback) {
            if (tokenQuery.values.userId != id.value) {
                return callback(token.errors.invalid());
            }
            return callback(null);
        },
        function (callback) {
            tokenResult.user.password = passwordHash.generate(password.value);
            tokenResult.user.save()
                .success(function () {
                    callback(null);
                })
                .error(callback);
        },
        function (callback) {
            res.json({
                'success': true
            });
            callback(null);
        }
    ], function (err, result) {
        if (err) {
            return next(err);
        }
    });
});

router.put('/user/:id', function(req, res, next) {
    // @TODO
});

module.exports = router;