const response = require('../../utils/response');
const officialDocumentRepository = require('../../repository/officialDocument');

function getOfficialDocument(req, res, next) {
  const query = {
    attributes: ['id', 'name', 'institutionName'],
    required: true
  };

  return officialDocumentRepository
    .find(query)
    .then(result => res.json(response.successData(result)))
    .catch((err) => {
      console.log(err);
      next(response.errorMessage(500, 'Internal Server Error'));
    });
}

module.exports = {
  getOfficialDocument
};
