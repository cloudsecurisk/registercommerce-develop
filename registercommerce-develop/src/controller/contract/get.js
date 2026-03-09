const fetch = require('node-fetch');
const config = require('config');
const generalInfoRepository = require('../../repository/generalInfo');
const response = require('../../utils/response');
const { generateCincelJWT } = require('../../utils/cincel');

const createDocUrl = config.get('cincel.createDocUrl');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('contract-controller');


async function getContract(req, res, next) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  const { idCommerce } = req.params;
  const query = {
    where: {
      idCommerce
    },
    attributes: [
      'contract'
    ],
    raw: true
  };

  const cincelToken = await generateCincelJWT();
  return generalInfoRepository.findOne(query)
    .then((details) => {
      fetch(`${createDocUrl}/${details.contract}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cincelToken}`
        }
      })
        .then(responseCincel => responseCincel.json())
        .then((resultCincel) => {
          if (resultCincel) {
            Glogger.info({
              message: 'Get contract successfully.',
              user: {
                id,
                email,
                idSession
              },
              status: 200
            }, req);
            return res.json(response.successData(resultCincel));
          }
          Glogger.error({
            message: 'Error getting contract.',
            user: {
              id,
              email,
              idSession
            },
            status: 500
          }, req);
          return next(response.errorMessage(404, 'Internal Server Error Contract'));
        })
        .catch((err) => {
          console.log(err);
          Glogger.error({
            message: 'Error getting contract.',
            user: {
              id,
              email,
              idSession
            },
            status: 500
          }, req, err);
          return next(response.errorMessage(500, 'Internal Server Error', err));
        });
    });
}

module.exports = {
  getContract
};
