const { findDocsTypes } = require('../repository/v2/commerceDocument');
const response = require('../utils/response');

function getCommerceDocumentTypes(req, res) {
  const query = {
    raw: true,
    nest: true,
    attributes: ['id', 'clave', 'description'],
  };

  return findDocsTypes(query)
    .then((result) => {
      res.status(200).json(response.successData(result));
    })
    .catch(() => {
      res.status(500).json(response.errorMessage(500, 'Internal Server Error'));
    });
}

module.exports = getCommerceDocumentTypes;
