const { onboarding: Onboarding } = require('../../models');

function save(query) {
  return Onboarding.create({ ...query });
}

function findOne(query) {
  return Onboarding.findOne({ ...query });
}

function findByPk(id) {
  return Onboarding.findByPk(id);
}

function update(attributes, where) {
  return Onboarding.update({ ...attributes }, { where });
}

module.exports = {
  save,
  findOne,
  findByPk,
  update
};
