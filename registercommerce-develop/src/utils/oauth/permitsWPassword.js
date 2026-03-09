const fetch = require('node-fetch');
const config = require('config');
const responseUtil = require('../response');
const sendHeaders = require('../sendHeaders');

const oauthURL = config.get('belugaOauth.url');

/* eslint operator-linebreak: 0 */
/**
 * setup
 * setup oauth middleware
 * @param {object} settings
 * @param {string} settings.route - specify which route the user tries to access
 * @param {boolean} settings.passUser - [Optional] specify if the user info needs
 * to be pass to the next middleware on res.locals
 */
module.exports = function setup(settings) {
  return function hasPermission(req, res, next) {
    const ENDPOINT = 'authorizedPassword';
    const authorization = req.get('authorization');
    const query = `?route=${settings.route}&module=ecommerce&method=${req.method}`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization
      },
      body: JSON.stringify({
        password: req.body.password,
        ...sendHeaders(req)
      })
    };

    fetch(`${oauthURL}/${ENDPOINT}${query}`, options)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Not authorized');
      })
      .then((body) => {
        const jsonBody = typeof body === 'string' ? JSON.parse(body) : body;
        if (jsonBody.payload.user) {
          if (settings.passUser) {
            res.locals.user = jsonBody.payload.user;
          }
          return next();
        }
        throw new Error('Not authorized');
      })
      .catch(() => next(responseUtil.error(401, 'Not authorized')));
  };
};
