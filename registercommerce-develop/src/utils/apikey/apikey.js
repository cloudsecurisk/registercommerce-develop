const crypto = require('crypto');

function apikeyToSha512(key) {
  return crypto
    .createHash('sha512')
    .update(key, 'utf-8')
    .digest('hex');
}

module.exports = apikeyToSha512;
