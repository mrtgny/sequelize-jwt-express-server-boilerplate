const jwt = require("jsonwebtoken");
const _ = require("lodash");
const app_config = require("./config/app_config");
const secret = app_config.app.secret;

function where(params, alias) {
    const length = Object.keys(params).length;
    let cond = "";
    if (length) {
        cond += " where ";
        Object.keys(params).forEach((i, index) => {
            if (!index) cond += ` ${i} = :${i} `;
            else cond += ` and ${i} = :${i} `;
        });
        return cond;
    } else {
        return "";
    }
}

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err)
            }

            resolve(decodedToken)
        })
    })
}

function createJWToken(details) {
    if (typeof details !== 'object') {
        details = {}
    }

    if (!details.maxAge || typeof details.maxAge !== 'number') {
        details.maxAge = 24 * 60 * 60 * 1000
    }

    return jwt.sign({
        data: details
    }, secret, {
        expiresIn: details.maxAge,
        algorithm: 'HS256'
    })
}


function verifyJWT_MW(req, res, next) {
    let token = req.cookies[app_config.app["cookie-name"]];
    console.log("req", req.path);
    if (req.method !== "OPTIONS") {
        console.log("token", token, req.method);
        verifyJWTToken(token)
            .then((decodedToken) => {
                req.user = decodedToken.data;
                next()
            })
            .catch((err) => {
                console.log("Invalid auth token", err);
                res.status(403).send({message: "Invalid auth token provided."})
            })
    } else {
        console.log("else");
        next()
    }
}

module.exports = {
    where,
    verifyJWTToken,
    createJWToken,
    verifyJWT_MW,
    secret
};
