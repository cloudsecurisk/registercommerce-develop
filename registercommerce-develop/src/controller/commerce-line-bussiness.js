const commerceLineBussinessRepository = require('../repository/commerce-line-bussiness');
const { response } = require('../utils');
const Logger = require('../utils/logger/GLogger');

const Glogger = new Logger('commerce-controller');

function getEcommerceLineBussiness(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  return commerceLineBussinessRepository
    .findAll({
      order: [
        ['name', 'ASC']
      ],
      attributes: [
        'id',
        'name'
      ]
    })
    .then((commercePlans) => {
      Glogger.info({
        message: 'Get commerce line bussiness successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      return res.json(response.successData(commercePlans));
    })
    .catch((err) => {
      Glogger.error({
        message: 'Error getting commerce line bussiness.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      return next(response.errorMessage(500, 'Internal Server Error'));
    });
}

function getEcommerceLineBussinessASP(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  return commerceLineBussinessRepository
    .findAllLineBusinessASP({
      order: [
        ['name', 'ASC']
      ],
      attributes: [
        'id',
        'name'
      ]
    })
    .then((commercePlans) => {
      Glogger.info({
        message: 'Get ASP commerce line bussiness successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      res.json(response.successData(commercePlans));
    })
    .catch((err) => {
      Glogger.error({
        message: 'Error getting ASP commerce line bussiness.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      next(response.errorMessage(500, 'Internal Server Error'));
    });
}

function getOccupationASP(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  return commerceLineBussinessRepository
    .findAllOccupation({
      order: [
        ['name', 'ASC']
      ],
      attributes: [
        'id',
        'name'
      ]
    })
    .then((commercePlans) => {
      Glogger.info({
        message: 'Get occupation successfully.',
        user: {
          id,
          email,
          idSession
        },
        status: 200
      }, req);
      res.json(response.successData(commercePlans));
    })
    .catch((err) => {
      Glogger.error({
        message: 'Error getting occupation.',
        user: {
          id,
          email,
          idSession
        },
        status: 500
      }, req, err);
      next(response.errorMessage(500, 'Internal Server Error'));
    });
}

module.exports = {
  getEcommerceLineBussiness,
  getEcommerceLineBussinessASP,
  getOccupationASP
};
