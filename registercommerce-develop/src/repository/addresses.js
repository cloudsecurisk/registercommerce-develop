const {
  addresses: Addresses
} = require('../../models');

function update(updateData, where) {
  return Addresses.update(updateData, { where });
}

function save(query) {
  return Addresses.create({ ...query });
}

module.exports = {
  update,
  save,
};
