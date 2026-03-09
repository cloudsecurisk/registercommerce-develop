const { contract: Contract } = require('../../models');

function destroy(where) {
  return Contract.update(
    {
      deletedAt: new Date()
    },
    {
      where
    }
  );
}

function findOne(query) {
  return Contract.findOne(query);
}


module.exports = {
  destroy,
  findOne
};
