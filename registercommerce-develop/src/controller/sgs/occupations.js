const occupationSGSRepository = require('../../repository/occupation-sgs');
const response = require('../../utils/response');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('sgs-controller');


async function getOccupationsSGS(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };
  try {
    const occupations = await occupationSGSRepository.find();
    Glogger.info({
      message: 'Get occupations successfully',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(
      response.successData(occupations)
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Glogger.error({
      message: 'Error getting occupations',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res
      .status(500)
      .json(
        response.errorMessage(500, [
          'Error al obtener las ocupaciones',
          error.message
        ])
      );
  }
}

module.exports = getOccupationsSGS;
