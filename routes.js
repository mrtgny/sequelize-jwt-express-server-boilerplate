const users = require("./methods/users");
const sample = require("./methods/sample");
const auth = require("./methods/auth");
const {verifyJWT_MW} = require("./utils");

users.sync();
sample.sync();

const authRoutes = app => {
    app.get("/api/auth/autherized", auth.isAutherized);
    app.post("/api/auth/login", auth.login);
    app.post("/api/auth/logout", auth.logout);
};

const userRoutes = app => {
    app.post("/api/users/create", users.create);
    app.get("/api/users/fetchData", users.fetchData);
    app.post("/api/users/fetchData", users.fetchData);
    app.post("/api/users/update", users.update);
    app.post("/api/users/deleteRecord", users.deleteRecord);
};

const sampleRoutes = app => {
    app.get("/api/sample/fetchData", sample.fetchData);
    app.post("/api/sample/fetchData", sample.fetchData);
    app.post("/api/sample/create", sample.create);
    app.post("/api/sample/deleteRecord", sample.deleteRecord);
    app.post("/api/sample/update", sample.update);
};


module.exports = app => {
    /* The following endpoints are public.*/
    app.get("/api", (req, res) =>
        res.status(200).send({
            message: "Welcome to the JSF API!"
        })
    );
    authRoutes(app);

    /* The above endpoints are public.*/
    /* verifyJWT_MW is an authorization controller. */
    app.all('*', verifyJWT_MW);

    /* The following endpoints are protected.*/
    userRoutes(app);
    sampleRoutes(app);
};
