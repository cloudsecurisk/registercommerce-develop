const { Op } = require('sequelize');
const response = require('../utils/response');
const countriesRespository = require('../repository/countries');
const Logger = require('../utils/logger/GLogger');

const Glogger = new Logger('countries-controller');

function getCountries(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  const queryCountries = {
    where: {
      deletedAt: {
        [Op.eq]: null
      }
    },
    order: [
      ['name', 'ASC']
    ],
    attributes: ['id', 'code', 'name'],
    required: true
  };

  return countriesRespository
    .findAll(queryCountries)
    .then((result) => {
      Glogger.info({
        message: 'Get countries successfully.',
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
      console.log(err);
      Glogger.error({
        message: 'Error getting countries.',
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
  getCountries
};
