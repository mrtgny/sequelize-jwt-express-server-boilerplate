'use strict';
const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");
const app_config = require("../config/app_config");

const Users = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    }
}, {
    schema: app_config.sequelize.schema
});

module.exports = Users;