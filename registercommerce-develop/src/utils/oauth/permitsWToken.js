const fetch = require('node-fetch');
const config = require('config');
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
  const ENDPOINT = 'authorized2Fact';
  const query = `?route=${settings.route}&module=${settings.module}&method=${settings.method}&twoFact=${settings.token}`;

  const options = {
    method: 'GET',
    url: `${oauthURL}/${ENDPOINT}${query}`,
    headers: {
      authorization: settings.authorization,
      ...sendHeaders(settings.req)
    }
  };

  return fetch(`${oauthURL}/${ENDPOINT}${query}`, options)
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
          return jsonBody.payload;
        }
        return true;
      }
      throw new Error('Not authorized');
    });
};
