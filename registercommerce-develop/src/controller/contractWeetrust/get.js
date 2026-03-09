/* eslint-disable no-console */
const config = require('config');
const fetch = require('node-fetch');
// const generalInfoRepository = require('../../repository/generalInfo');
const contractRepository = require('../../repository/contract');
// const {
//   contract: Contract,
//   commerces: Commerce
// } = require('../../../models');
const response = require('../../utils/response');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('contract-weetrust-controller');

async function getContractWeestrust(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  try {
    const { idCommerce } = req.params;
    const query = {
      where: {
        idCommerce,
        deletedAt: null
      },
      raw: true
    };
    const contractDb = await contractRepository.findOne(query);

    if (!contractDb) {
      return res.json(response.errorMessage(404, 'Contract not found'));
    }


    const contractID = contractDb.contract;
    if (!contractID) {
      return res.json(response.errorMessage(404, 'Contract not found'));
    }

    const url = config.get('weetrust.base');
    const userId = config.get('weetrust.userId');
    const apiKey = config.get('weetrust.apiKey');

    const accessTokenResponse = await fetch(`${url}/access/token`, {
      method: 'POST',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
      },
    });

    const {
      responseData: { accessToken: token },
    } = await accessTokenResponse.json();

    const contractResponse = await fetch(`${url}/documents/${contractID}`, {
      method: 'GET',
      headers: {
        'user-id': userId,
        'api-key': apiKey,
        token,
      },
    });

    const contract = await contractResponse.json();
    Glogger.info({
      message: 'Get contract successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.json(response.successData(contract));
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error getting contract.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.json(response.errorMessage(500, 'Internal Server Error', error));
  }
}

module.exports = {
  getContractWeestrust,
};
