const fetch = require('node-fetch');
const config = require('config');

const oauthURL = config.get('belugaOauth.url');

const sendHeaders = require('../sendHeaders');
const Logger = require('../../utils/logger/GLogger');
const { getPayloadToken } = require('../../controller/tokens');

const Glogger = new Logger('permits-middleware');

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
  const ENDPOINT = 'authorized';
  const query = `?route=${settings.route}&module=${settings.module}&method=${settings.method}`;

  const options = {
    method: 'GET',
    url: `${oauthURL}/${ENDPOINT}${query}`,
    headers: {
      authorization: settings.authorization,
      ...sendHeaders(settings.req)
    },
  };

  const payloadToken = getPayloadToken(settings.authorization);
  return fetch(`${oauthURL}/${ENDPOINT}${query}`, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      Glogger.error({
        message: 'Oauth not authorized',
        status: 400,
        user: {
          id: payloadToken && payloadToken.id ? payloadToken.id : null,
          email: payloadToken && payloadToken.email ? payloadToken.email : null,
        },
      }, settings.req);
      throw new Error('Not authorized', { cause: { code: response.status, reason: response.statusText } });
    })
    .then((body) => {
      const jsonBody = typeof body === 'string' ? JSON.parse(body) : body;
      if (jsonBody.payload.user) {
        if (settings.passUser) {
          return jsonBody.payload;
        }
        return true;
      }
      Glogger.error({
        message: 'Not authorized',
        status: 400,
        user: {
          id: payloadToken && payloadToken.id ? payloadToken.id : null,
          email: payloadToken && payloadToken.email ? payloadToken.email : null,
        },
      }, settings.req);
      throw new Error('Not authorized');
    });
};
