const {
  commerceDocumentV2: CommerceDocumentV2,
  commerceDocumentType: CommerceDocumentType
} = require('../../../models');

function find(query) {
  return CommerceDocumentV2.findAll({ ...query, raw: true });
}

function findOne(query) {
  return CommerceDocumentV2.findOne({ ...query });
}

function findByPk(id) {
  return CommerceDocumentV2.findByPk(id);
}

function update(data, where) {
  return CommerceDocumentV2
    .update({ ...data }, { where });
}

function save(query) {
  return CommerceDocumentV2.create({ ...query });
}

/** Funcion para buscar tipos de documentos */
function findDocsTypes(query) {
  return CommerceDocumentType.findAll({ ...query });
}

module.exports = {
  find,
  findOne,
  findByPk,
  update,
  save,
  findDocsTypes
};
