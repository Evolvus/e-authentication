const debug = require("debug")("evolvus-platform-server:routes:api:user");
const _ = require("lodash");
const user = require("evolvus-user");
const application = require("evolvus-application");

const headerAttributes = ["tenantid", "entityid", "accessLevel"];
const credentials = ["userName", "userPassword", "applicationCode"];
const response = {};
module.exports = (router) => {
    router.route("/user/authenticate")
        .post((req, res, next) => {
            try {
                console.log('Received', credentials);
                let body = _.pick(req.body, credentials);
                console.log('Login user', body.userName);
                user.authenticate(body).then((user) => {
                    res.status(200).send(user);
                }).catch((e) => {
                    console.log('error', e);
                    const error = {
                        status: '404',
                        data: e,
                        description: `${e.toString()}`
                    }
                    res.status(404).send(error);
                });
            } catch (e) {
                console.log('error e:', e);
                const error = {
                    status: '404',
                    data: e,
                    description: `${e.toString()}`
                }
                res.status(404).send(error);
            }
        });

    router.route("/user/updateToken")
        .post((req, res, next) => {
            try {
                let body = _.pick(req.body, ["token", "id"]);
                console.log('Updating toke for the user', body.id);
                user.updateToken(body.id, body.token).then((user) => {
                    res.status(200).send(user);
                }).catch((e) => {
                    const error = {
                        status: '404',
                        data: e,
                        description: `${e.toString()}`
                    }
                    res.status(404).send(error);

                });
            } catch (e) {
                const error = {
                    status: '404',
                    data: e,
                    description: `${e.toString()}`
                }
                res.status(404).send(error);

            }
        });
}