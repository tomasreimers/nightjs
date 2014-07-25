var databaseConfigs = require('../config/database');

var db = {};

db.Sequelize = require('sequelize');
db.sequelize = new db.Sequelize(databaseConfigs.url, databaseConfigs.options);

db.Users = db.sequelize.define('user', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: db.Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: true
    }
});

db.AuthTokens = db.sequelize.define('authToken', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
});

db.Users.hasMany(db.AuthTokens);
db.AuthTokens.belongsTo(db.Users, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
});

// ADD ADDITIONAL MODELS HERE

module.exports = db;