// eslint-disable-next-line no-unused-expressions
const allowedServices = require('config').get('allowedServices');
const permits = require('../utils/oauth/permits');
const permitsWToken = require('../utils/oauth/permitsWToken');
const response = require('../utils/response');
const apikeyToSha512 = require('../utils/apikey/apikey');

const { getPayloadToken } = require('../controller/tokens');
const Logger = require('../utils/logger/GLogger');

const Glogger = new Logger('permits-middleware');

function hasPermitsOauth(req, res, next) {
  const { route, module, method } = req.query;
  return permits({
    route,
    module,
    method,
    passUser: true,
    authorization: req.get('authorization'),
    req
  }).then((oauthPermit) => {
    res.locals.user = oauthPermit.user;
    return next();
  }).catch((err) => {
    const tokenUser = getPayloadToken(req.get('authorization'));
    const statusCode = (err.cause || {}).code ? err.cause.code : '403';
    const statusCodeText = (err.cause || {}).reason ? err.cause.reason : 'Not authorized';
    Glogger.error({
      message: 'Error validating permissions in OAuth',
      status: 403,
      user: {
        email: (tokenUser && tokenUser.email) ? tokenUser.email : null,
        id: (tokenUser && tokenUser.id) ? tokenUser.id : null,
        idSession: (tokenUser && tokenUser.idSession) ? tokenUser.idSession : null,
      },
    }, req, err);
    next(response.errorMessage(statusCode, statusCodeText));
  });
}

function hasPermitsOauthWToken(req, res, next) {
  const {
    route, module, method, twoFact
  } = req.query;
  return permitsWToken({
    route,
    module,
    method,
    passUser: true,
    token: twoFact,
    authorization: req.get('authorization'),
    req
  }).then((oauthPermit) => {
    res.locals.user = oauthPermit.user;
    return next();
  }).catch((err) => {
    const tokenUser = getPayloadToken(req.get('authorization'));
    Glogger.error({
      message: 'Error validating permissions in OAuth',
      status: 403,
      user: {
        email: (tokenUser && tokenUser.email) ? tokenUser.email : null,
        id: (tokenUser && tokenUser.id) ? tokenUser.id : null,
        idSession: (tokenUser && tokenUser.idSession) ? tokenUser.idSession : null,
      },
    }, req, err);

    return next(response.errorMessage(401, 'Not authorized'));
  });
}

function hasPermitsOauthCommerceService(settings) {
  return function setup(req, res, next) {
    try {
      const apikey = req.get('x-api-key');
      if (apikey) {
        res.locals.user = { id: null, email: null };
        const apikeySha512 = apikeyToSha512(apikey);
        if (allowedServices.find(api => (
          apikeySha512 === api.hash && settings.service && settings.service.includes(api.name)
        ))) {
          return next();
        }
        Glogger.error({
          message: 'Not valid apikey',
          status: 403,
          user: {
            apikey: apikey.split('.')[0] || null,
            email: (req.body && req.body.email) ? req.body.email : null,
          },
        }, req);
        return next(response.errorMessage(403, 'Not authorized'));
      }
      return permits({
        route: settings.route,
        module: 'registerCommerce',
        method: req.method,
        passUser: settings.passUser,
        authorization: req.get('authorization'),
        req
      }).then((oauthPermit) => {
        res.locals.user = oauthPermit.user;
        return next();
      }).catch((err) => {
        const tokenUser = getPayloadToken(req.get('authorization'));
        Glogger.error({
          message: 'Error validating permissions in OAuth',
          status: 403,
          user: {
            email: (tokenUser && tokenUser.email) ? tokenUser.email : null,
            id: (tokenUser && tokenUser.id) ? tokenUser.id : null,
            idSession: (tokenUser && tokenUser.idSession) ? tokenUser.idSession : null,
          },
        }, req, err);
        return next(response.errorMessage(403, 'Not authorized'));
      });
    } catch (err) {
      const tokenUser = getPayloadToken(req.get('authorization'));
      Glogger.error({
        message: 'Error validating permissions in OAuth',
        status: 403,
        user: {
          email: (tokenUser && tokenUser.email) ? tokenUser.email : null,
          id: (tokenUser && tokenUser.id) ? tokenUser.id : null,
          idSession: (tokenUser && tokenUser.idSession) ? tokenUser.idSession : null,
        },
      }, req, err);
      return next(response.errorMessage(403, 'Not authorized'));
    }
  };
}

module.exports = {
  hasPermitsOauth,
  hasPermitsOauthCommerceService,
  hasPermitsOauthWToken
};
