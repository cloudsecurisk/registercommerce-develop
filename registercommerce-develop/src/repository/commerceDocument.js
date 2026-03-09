const {
  commerceDocument: CommerceDocument
} = require('../../models');

function find(query) {
  return CommerceDocument.findAll({ ...query, raw: true });
}

function findOne(query) {
  return CommerceDocument.findOne({ ...query });
}

function update(data, where) {
  return CommerceDocument
    .update(data, where);
}

function save(query) {
  return CommerceDocument.create({ ...query });
}

function deleteFn(where) {
  return CommerceDocument.destroy({ ...where });
}

module.exports = {
  find,
  findOne,
  update,
  save,
  deleteFn
};
