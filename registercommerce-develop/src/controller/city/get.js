const response = require('../../utils/response');
const cityRepository = require('../../repository/cities');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('countries-controller');

async function getCountries(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  const idState = req.params.id;
  try {
    const query = {
      where: {
        idState
      },
      order: [
        ['name', 'ASC']
      ]
    };

    Glogger.info({
      message: 'Get cities successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData(await cityRepository.find(query)));
  } catch (ex) {
    Glogger.error({
      message: 'Error creating commerce.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, ex);
    return next(response.errorMessage(500, 'Internal Server Error'));
  }
}

module.exports = {
  getCountries
};
