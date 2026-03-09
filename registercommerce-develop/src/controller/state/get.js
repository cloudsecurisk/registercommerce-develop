const response = require('../../utils/response');
const stateRepository = require('../../repository/states');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('state-controller');


async function getStates(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  try {
    const query = {
      order: [
        ['name', 'ASC']
      ],
      attributes: ['id', 'clave', 'name', 'abrev'],
      required: true
    };
    const states = await stateRepository.find(query);

    Glogger.info({
      message: 'Get states successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData(states));
  } catch (ex) {
    Glogger.error({
      message: 'Error getting states.',
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
  getStates
};
