const { financialInformation: FinancialInformation } = require('../../models');

function update(updateInfo, where) {
  return FinancialInformation.update(updateInfo, { where });
}

function save(query) {
  return FinancialInformation.create({ ...query });
}

module.exports = {
  update,
  save
};
