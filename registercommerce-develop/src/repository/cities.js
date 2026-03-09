const { cities: Cities } = require('../../models');

function find(query = {}) {
  return Cities.findAll({ ...query, raw: true });
}

module.exports = {
  find
};
