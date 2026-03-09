const { commerceSettings: CommerceSettings } = require('../../models');

function findOne(query) {
  return CommerceSettings.findOne(query);
}

function update(updateInfo, where) {
  return CommerceSettings.update(updateInfo, { where });
}

function increment(where, by = 1) {
  return CommerceSettings.increment('recordSubmissionFileAmex', { by, where });
}

module.exports = {
  findOne,
  update,
  increment
};
