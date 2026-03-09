const response = require('../../utils/response');
const organizationRepository = require('../../repository/organization');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('commerce-controller');


function getCommerceUser(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  try {
    const { idCommerce } = req.params;
    const { module } = req.query;

    const moduleConditions = {
      transfer: { idRoleTransfer: 1 },
      cards: { idRoleCards: 1 },
    };

    const where = moduleConditions[module] || {};

    const query = {
      attributes: ['idUser'],
      where: {
        ...where,
        idCommerce
      }
    };

    return organizationRepository.findOne(query)
      .then((result) => {
        Glogger.info({
          message: 'Get commerce user successfully.',
          user: {
            id,
            email,
            idSession
          },
          status: 200
        }, req);
        res.json(response.successData(result));
      })
      .catch((err) => {
        Glogger.error({
          message: 'Error getting commerce user.',
          user: {
            id,
            email,
            idSession
          },
          status: 500
        }, req, err);
        return next(response.errorMessage(500, 'Internal Server Error'));
      });
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error getting commerce user.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = getCommerceUser;
