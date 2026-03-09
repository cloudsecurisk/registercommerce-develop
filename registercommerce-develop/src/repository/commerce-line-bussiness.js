const {
  lineBusiness: LineBussiness,
  lineBusinessASP: LineBussinessASP,
  occupationASP: OccupationASP,
} = require('../../models');

function findAll(query = {}) {
  return LineBussiness.findAll(query);
}

function findAllLineBusinessASP(query = {}) {
  return LineBussinessASP.findAll(query);
}

function findAllOccupation(query = {}) {
  return OccupationASP.findAll(query);
}

module.exports = {
  findAll,
  findAllLineBusinessASP,
  findAllOccupation
};
