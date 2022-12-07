var ActiveDirectory = require('activedirectory');
var ldapconfig = require('./ldapconfig.js');
const debug = require("debug")("evolvus-e-authentication:routes:api:user");
const _ = require("lodash");
const user = require("@evolvus/evolvus-user");
var applicationCode = process.env.APPLICATION_CODE || "SANDSTORM";

const headerAttributes = ["tenantid", "entityid", "accessLevel"];
const credentials = ["userName", "userPassword", "applicationCode"];
const response = {};
var config = {
  url: ldapconfig.url,
  baseDN: ldapconfig.baseDN,
  domain: ldapconfig.domain
};
var ad = new ActiveDirectory(config);

module.exports = (router) => {
  router.route("/user/authenticate")
    .post((req, res, next) => {
      debug("input userId:", req.body.userName);
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      try {
        let object = _.pick(req.body, credentials);
        debug("Application Code:",object.applicationCode);
        if (object.applicationCode === applicationCode) {
          user.findUserName(object.userName, object.applicationCode)
            .then((result) => {
              if (result) {
                let username = `${object.userName}${config.domain}`;
                debug("UserName :", username);
                ad.authenticate(username, object.userPassword, function (err, auth) {
                  if (err) {
                    debug('ERROR: ' + JSON.stringify(err));
                    response.status = "401";
                    response.description = `Active Directory Authentication failed!`;
                    res.status(401).send(response);
                  } else if (auth) {
                    debug('Both Console and Active Directory Authenticated!');
                    response.description = `Both Console and Active Directory Authenticated!`;
                    response.data = auth;
                    res.status(200).send(result);
                  } else {
                    debug('Active Directory Authentication failed!');
                    response.status = "401";
                    response.description = `Authentication failed!`;
                    response.data = auth;
                    res.status(401).send(response);
                  }
                });
              } else {
                debug('Console Authentication failed!');
                response.status = "401";
                response.description = `Console Authentication failed!`;
                response.data = "";
                res.status(401).send(response);
              }
            }).catch((e) => {
              debug('Console Authentication failed!', e);
              response.status = "401";
              response.description = `Console Authentication failed!`;
              response.data = e;
              res.status(401).send(response);
            });
          }else {
          debug('Received', credentials);
          let body = _.pick(req.body, credentials);
          debug('Login user', body.userName);
          user.authenticate(body).then((user) => {
            debug('User LoggedIn', user._id);
            res.status(200).send(user);
          }).catch((e) => {
            debug('error', e);
            const error = {
              status: '401',
              data: e,
              description: `${e.toString()}`
            };
            res.status(401).send(error);
          });
        }
      } catch (e) {
        debug("try-catch failed", e);
        response.status = 401;
        response.description = `Authentication failed!`;
        response.data = e;
        res.status(401).send(response);
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