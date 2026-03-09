const { legalRepresentative: LegalRepresentative } = require('../../models');

function update(updateInfo, where) {
  return LegalRepresentative.update(updateInfo, { where });
}

function save(query) {
  return LegalRepresentative.create({ ...query });
}

module.exports = {
  update,
  save
};
