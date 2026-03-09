const config = require('config');
const fetch = require('node-fetch');

const cincelBasicToken = config.get('cincel.token');
const cincelJWTUrl = config.get('cincel.jwtUrl');
const docsURL = config.get('cincel.createDocUrl');

function generateCincelJWT() {
  const options = {
    method: 'GET',
    url: cincelJWTUrl,
    headers: {
      Authorization: `Basic ${cincelBasicToken}`
    }
  };

  return fetch(cincelJWTUrl, options)
    .then((response) => {
      if (response.status === 200) {
        return response.text();
      }
      throw new Error('Not authorized');
    });
}

async function signInvitation(name, email, documentUUID) {
  const token = generateCincelJWT();
  const options = {
    method: 'POST',
    url: `${docsURL}/${documentUUID}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
      name,
      email,
      type: 'signer'
    },
    json: true
  };

  return fetch(docsURL, options)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Not authorized');
    });
}

module.exports = {
  generateCincelJWT,
  signInvitation
};
