'use strict';
const Sequelize = require('sequelize');
const app_config = require("./app_config");

const sequelize = new Sequelize(app_config.sequelize.database, app_config.sequelize.username, app_config.sequelize.password, {
    host: app_config.sequelize.host,
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = sequelize;