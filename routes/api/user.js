const debug = require("debug")("evolvus-platform-server:routes:api:user");
const _ = require("lodash");
const user = require("@evolvus/evolvus-user");
const application = require("@evolvus/evolvus-application");

const headerAttributes = ["tenantid", "entityid", "accessLevel"];
const credentials = ["userName", "userPassword", "applicationCode"];
const response = {};
module.exports = (router) => {
  router.route("/user/authenticate")
    .post((req, res, next) => {
      try {
        debug('Received', credentials);
        let body = _.pick(req.body, credentials);
        debug('Login user', body.userName);
        user.authenticate(body).then((user) => {
          debug(user._id);
          res.status(200).send(user);
        }).catch((e) => {
          debug('error', e);
          const error = {
            status: '404',
            data: e,
            description: `${e.toString()}`
          }
          res.status(404).send(error);
        });
      } catch (e) {
      debug('error e:', e);
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
        debug('Updating toke for the user', body.id);
        user.updateToken(body.id, body.token).then((user) => {
          debug('Updating user token')
          res.status(200).send(user);
        }).catch((e) => {
          debug('Updating user token failed', e);
          const error = {
            status: '404',
            data: e,
            description: `${e.toString()}`
          }
          res.status(404).send(error);

        });
      } catch (e) {
        debug('Updating user token failed ..', e);
        const error = {
          status: '404',
          data: e,
          description: `${e.toString()}`
        }
        res.status(404).send(error);

      }
    });
}
