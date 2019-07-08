const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app_config = require("./config/app_config");

const app = express();

var allowHeaders = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", app_config.app["client-host"]);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,Cache-Control");

    next();
};

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

require("./config/sequelize");
app.use(allowHeaders);

require("./routes")(app);

app.get("*", (req, res) =>
    res.status(200).send({
        message: "Welcome to the beginning of nothingness."
    })
);

module.exports = app;
