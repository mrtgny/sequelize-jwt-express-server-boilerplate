const Users = require("../tables/users");
const sequelize = require("../config/sequelize");
const {verifyJWTToken, createJWToken} = require("../utils");
const app_config = require("../config/app_config");

module.exports = {
    isAutherized(req, res) {
        const token = req.cookies[app_config.app["cookie-name"]];
        console.log("req", token);
        if (token)
            verifyJWTToken(token)
                .then((decodedToken) => {
                    console.log("*****XXXXX\n\n\n\n", decodedToken, "\n\n\n\n");
                    res.status(201).send(decodedToken.data)
                })
                .catch((err) => {
                    console.log("Invalid auth token", err);
                    res.status(403).send({message: "Invalid auth token provided."})
                });
        else
            return res.status(403).send({message: "Invalid auth token provided."})
    },
    logout(req, res) {
        console.log("*** logout ***");
        res.status(201).send({message: "Success"});
    },
    login(req, res) {
        return sequelize
            .query(
                `SELECT username,firstname || ' ' || lastname as fullname,id FROM ${app_config.sequelize.schema}.users where  username = :username and password = :password`,
                {replacements: req.body, type: sequelize.QueryTypes.SELECT}
            )
            .then(([Users]) => {
                if (Users) {
                    console.log("Users", Users);
                    const details = {...Users};
                    const token = createJWToken(details);
                    return res.status(201).send({token, ...Users})
                } else {
                    res.status(400).send({
                        message: "Username or password not correct!"
                    })
                }
            })
            .catch(error => {
                console.log("error", error);
                res.status(400).send(error)
            });
    }
};
