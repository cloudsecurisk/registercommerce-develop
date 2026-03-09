const fetch = require('node-fetch');

module.exports = function sendRequest(settings) {
  const {
    method,
    url,
    headers,
    body
  } = settings;

  let options = {
    method
  };

  if (headers) {
    options = {
      ...options,
      headers
    };
  }

  if (body) {
    options = {
      ...options,
      body: JSON.stringify(body)
    };
  }

  console.log('Request:', url, JSON.stringify(options));
  return fetch(url, options)
    .then((response) => {
      if (response.status !== 200) {
        console.log('Response Error:', response);
      }
      return response.json().then((data) => {
        console.log('Response Json:', response.status, JSON.stringify(data));
        if (response.status === 200) {
          return data;
        }

        throw new Error('Not authorized');
      });
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      throw error;
    });
};
