const { occupationSGS: OccupationSGS } = require('../../models');

function find(query = {}) {
  return OccupationSGS.findAll({ ...query, raw: true });
}

module.exports = {
  find
};
