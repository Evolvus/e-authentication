var ActiveDirectory = require('activedirectory');
var ldapconfig = require('./ldapconfig.js');
const debug = require("debug")("evolvus-platform-server:routes:api:user");
const _ = require("lodash");
const user = require("@evolvus/evolvus-user");
console.log(user);

const application = require("@evolvus/evolvus-application");

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
      debug("input userId:",req.body.username);
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      try {
        let object = _.pick(req.body, ["username", "password"]);
        
        user.findUserName(object.username)
        .then((result)=> {
          debug("Found user"+result);
          if(result) {
            let username=`${object.username}${config.domain}`;
            ad.authenticate(username, object.password, function (err, auth) {
              if (err) {
                debug(err);
                console.log('ERROR: ' + JSON.stringify(err));
                response.status = "401";
                response.description = `${err}`;
                res.status(401).send(response);
              } else if (auth ) {
                debug('Both Console and Active Directory Authenticated!');
                response.description = `Both Console and Active Directory Authenticated!`;
                response.data = auth;
                res.status(200).send(response);
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
        }).catch((e)=> {
          debug(e);
            debug('Console Authentication failed!');
            response.status = "401";
            response.description = `Console Authentication failed!`;
            response.data = e;
            res.status(401).send(response);
        });
      } catch (e) {
        debug(e);
        response.status = 401;
        response.description = `Authentication failed!`;
        response.data = e;
        res.status(401).send(response);
      }

    //   try {
    //     debug('Received', credentials);
    //     let body = _.pick(req.body, credentials);
    //     debug('Login user', body.userName);
    //     user.authenticate(body).then((user) => {
    //       debug('User LoggedIn',user._id);
    //       res.status(200).send(user);
    //     }).catch((e) => {
    //       debug('error', e);
    //       const error = {
    //         status: '404',
    //         data: e,
    //         description: `${e.toString()}`
    //       }
    //       res.status(404).send(error);
    //     });
    //   } catch (e) {
    //   debug('error e:', e);
    //     const error = {
    //       status: '404',
    //       data: e,
    //       description: `${e.toString()}`
    //     }
    //     res.status(404).send(error);
    //   }
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
