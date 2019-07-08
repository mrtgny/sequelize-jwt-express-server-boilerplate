const Users = require("../tables/users");
const sequelize = require("../config/sequelize");
const jwt = require("jsonwebtoken");
const {secret} = require("../utils");
const app_config = require("../config/app_config");

module.exports = {
    create(req, res) {
        console.log("___***REQ***___", req);
        return Users.create({
            ...req.body
        })
            .then(Users => res.status(201).send(Users))
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        const {id, ...rest} = req.body;

        return Users.update(
            {
                ...rest
            },
            {
                where: {
                    id
                }
            }
        )
            .then(Users => res.status(201).send(Users))
            .catch(error => {
                console.log("\n\n\n *** ERROR *** \n\n", error, "\n\n");
                res.status(400).send(error)
            });
    },
    deleteRecord(req, res) {
        console.log("___***REQ***___", req);
        return Users.destroy({
            where: {
                ...req.body
            }
        })
            .then(Attachments => res.status(201).send({status: 201, message: "Deleted", ...req.body}))
            .catch(error => res.status(400).send(error));
    },
    fetchData(req, res) {
        const params = {
            attributes: ["username", "firstname", "lastname"]
        };
        const token = req.cookies[app_config.app["cookie-name"]];
        console.log(req, res);
        if (req.body) params.where = {...(params.where || {}), ...req.body};
        let sendPassword = false;
        jwt.verify(token, secret, (err, decodedToken) => {
            console.log("token", decodedToken, req.body.id);
            sendPassword = decodedToken.data.id === req.body.id || decodedToken.data.id === 1;
        });

        return sequelize
            .query(
                `
                SELECT * FROM ${app_config.sequelize.schema}.users u
                ${params.where.id ? 'where u.id = :id ' : ''} 
                `,
                {replacements: params.where, type: sequelize.QueryTypes.SELECT}
            )
            .then(Users => res.status(201).send(Users))
            .catch(error => {
                console.log("\n\n\n\n**** Error *** \n\n", error, "\n\n\n");
                res.status(400).send(error);
            })
    },
    sync() {
        return Users.sync();
    }
};
