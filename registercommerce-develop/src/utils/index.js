const response = require('./response');
const upload = require('./gcs/upload');
const oauth = require('./oauth/permits');
const oauthPassword = require('./oauth/permitsWPassword');

module.exports = {
  response,
  upload,
  oauth,
  oauthPassword
};
