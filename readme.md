# Night.JS 🌙

A node framework to create APIs.

## Version

0.0.1 (HIGHLY UNSTABLE, use not recommended)

## About

Night.JS is a boilerplate to write APIs in node. It provides utilities such as API Parameter fetching and validation, a preconfigured database, and some predefined routes for user registration and authentication.

## Impetus

This project was created as part of the Yelp Hackathon 14.0. In an attempt to make a boilerplate for later projects in node and practice using node.

## What's Included

### The server

The server is provided via express, as this is only intended as an API boilerplate, content should be served using `res.json`.

### The DB

Database connections are provided via sequelize, and can be configured in `config/database`.

Models can be defined in `models/`. And `model_helpers/` are provided to make common tasks easier.

### The Routes

There are two high level concepts already implemented: users and authentications.

#### Users

Users are the people who you know, and their details.

 - `GET /api/users`: Get a list of all users
 - `GET /api/user/:id`: Get details for one specific user
 - `POST /api/user`: Create a new user
 - `PUT /api/user/:id/password`: Update a user password
 - `PUT /api/user/:id`: Update a user

#### Auths

Auths are specific recognitions of individuals as certain users and the permissions for that individual to act with the rights of that user.

 - `GET /api/auths`: Get a list of all auths for the user logged in
 - `GET /api/auth/:id`: Get details for one specific login
 - `POST /api/auth`: Create an auth token (and login)
 - `DELETE /api/auth/:id`: Destroy an auth token (and logout)

### APIParam and APIError

`/util/api` provides APIParam and APIError.

#### APIParam

An object type that can be instanciated to represent a parameter. Take `name` as a constructor argument. The value can then be populated by `APIParam.fromRequest(req)` (which will pull it from the request with `req.param(APIParam.name)` or with `APIParam.define(newValue)`.

APIParams provide a way to validate themselves with `APIParam.validate` which takes a validation function and params to pass to it (if none are given, it will pass it's own value). It returns an instance of `APIError` on failure or `undefined` on success.

#### APIError

A specific error that will be caught and sent to the user as JSON representing a failed API response (while halting further execution).

### A new route

## License

Licensed under the MIT license.

## Author

@tomasreimers