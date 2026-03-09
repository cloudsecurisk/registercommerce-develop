const {
  countries: Countries
} = require('../../models');

function findAll(query) {
  return Countries.findAll(query);
}

module.exports = {
  findAll
};
