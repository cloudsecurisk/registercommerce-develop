const {
  generalInfo: GeneralInfo,
} = require('../../models');
const paginate = require('../utils/pagination');

function find(options, query) {
  return paginate(options, GeneralInfo, { ...query });
}

async function findRow(query) {
  return GeneralInfo.findAll({
    ...query,
  });
}

async function findOne(query) {
  return GeneralInfo.findOne(query);
}

function update(updateData, where) {
  return GeneralInfo.update(updateData, { where });
}

function save(query) {
  return GeneralInfo.create({ ...query });
}

module.exports = {
  find,
  findOne,
  update,
  findRow,
  save
};
