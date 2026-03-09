const {
  executives: Executives,
} = require('../../models');
const paginate = require('../utils/pagination');

function findPagination(options, query) {
  return paginate(options, Executives, { ...query });
}

function findOne(query) {
  return Executives.findOne(query);
}

function findAll(query) {
  return Executives.findAll(query);
}

function update(updateData, where) {
  return Executives.update(updateData, { where });
}

function saveExecutive(query) {
  return Executives.create({ ...query });
}

module.exports = {
  findPagination,
  findAll,
  update,
  saveExecutive,
  findOne
};
