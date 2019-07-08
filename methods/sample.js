const Sample = require("../tables/sample");
const sequelize = require("../config/sequelize");
const app_config = require("../config/app_config");
const {where} = require('../utils');

module.exports = {
    create(req, res) {
        return Sample.create({
            ...req.body
        })
            .then(Sample => res.status(201).send(Sample))
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        const {id, ...rest} = req.body;

        return Sample.update(
            {
                ...rest
            },
            {
                where: {
                    id
                }
            }
        )
            .then(Sample => res.status(201).send(Sample))
            .catch(error => res.status(400).send(error));
    },
    deleteRecord(req, res) {
        return Sample.destroy({
            where: {
                ...req.body
            }
        })
            .then(() => res.status(201).send({status: 201, message: "Deleted", ...req.body}))
            .catch(error => res.status(400).send(error));
    },
    fetchData(req, res) {

        const params = {attributes: ["id", "name"]};
        if (req.body) params.where = {...(params.where || {}), ...req.body};

        return sequelize.query(
            `select * ${app_config.sequelize.schema}.samples
            ${where(params.where)}
            `,
            {replacements: params.where, type: sequelize.QueryTypes.SELECT}
        )
            .then(Sample => res.status(201).send(Sample))
            .catch(error => res.status(400).send(error));
    },

    sync() {
        return Sample.sync();
    }
};
