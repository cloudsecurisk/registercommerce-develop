const response = require('../utils/response');
const generalInfoRepository = require('../repository/generalInfo');

function getCommerceInfoById(req, res, next) {
  const { idCommerce } = req.params || req.query || {};
  return generalInfoRepository.findOne({ where: { idCommerce } })
    .then((commerce) => {
      if (commerce.dataValues.id) {
        res.locals.idAddress = commerce.dataValues.idAddress;
        return next();
      }
      return next(response.errorMessage(403, 'Forbidden'));
    });
}

module.exports = getCommerceInfoById;
