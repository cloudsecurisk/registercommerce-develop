const { organization: Organization } = require('../../models');
const paginate = require('../utils/pagination');

function findOne(query) {
  return Organization.findOne(query);
}

function findAll(query) {
  return Organization.findAll(query);
}

function findPaginate(options, query) {
  return paginate(options, Organization, { ...query });
}

function save(query) {
  return Organization.create({ ...query });
}

function destroy(query) {
  return Organization.destroy({ ...query });
}

function update(attibutes, where) {
  return Organization.update(attibutes, { where });
}

module.exports = {
  findOne,
  findAll,
  save,
  destroy,
  update,
  findPaginate
};
