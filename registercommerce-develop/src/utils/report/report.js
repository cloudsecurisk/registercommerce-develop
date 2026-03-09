const fetch = require('node-fetch');
const config = require('config');

const utilsReports = require('./buildSubIds');

const reportURL = config.get('report.baseURL');
/**
 * @param {Object} query data
 * @param {Array} headers
 * @returns {Promise} result
 */

module.exports = function buildReport(query, headers, requestName = []) {
  const ENDPOINT = 'api/report/';

  return utilsReports.buildSubIds(query, headers, requestName)
    .then((infoReport) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: infoReport.query,
          header: infoReport.headers
        })
      };

      return fetch(`${reportURL}${ENDPOINT}`, options)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          throw new Error(response.statusText);
        })
        .then(body => body)
        .catch(err => err);
    })
    .catch((err) => {
      console.log(err);
    });
};
