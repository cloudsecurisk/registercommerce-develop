const { amexRecords: AmexRecords } = require('../../models');

function findOne(query) {
  return AmexRecords.findOne(query);
}

function update(updateInfo, where) {
  return AmexRecords.update(updateInfo, { where });
}

module.exports = {
  findOne,
  update
};
