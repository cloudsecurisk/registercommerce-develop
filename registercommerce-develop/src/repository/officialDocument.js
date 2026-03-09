const {
  officialDocument: OfficialDocument
} = require('../../models');

function find(query) {
  return OfficialDocument.findAll({ ...query, raw: true });
}

module.exports = {
  find
};
