const {
  comments: Comments
} = require('../../models');

function save(query) {
  return Comments.save({ ...query });
}

function findAll(query) {
  return Comments.findAll({ ...query });
}

module.exports = {
  save,
  findAll
};
