const { regcheqInformation: RegcheqInformation } = require('../../models');

function findOne(query) {
  return RegcheqInformation.findOne(query);
}

module.exports = {
  findOne
};
