"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../config/sequelize");
const app_config = require("../config/app_config");

const Sample = sequelize.define(
    "samples",
    {
        name: {
            type: Sequelize.STRING
        }
    },
    {
        schema: app_config.sequelize.schema
    }
);

module.exports = Sample;
