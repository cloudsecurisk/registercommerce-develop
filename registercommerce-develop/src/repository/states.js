const { states: States } = require('../../models');

function find(query = {}) {
  return States.findAll({ ...query, raw: true });
}

module.exports = {
  find
};
