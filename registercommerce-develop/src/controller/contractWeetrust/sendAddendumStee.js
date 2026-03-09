/* eslint-disable no-console */
const { v4: uuid } = require('uuid');
const response = require('../../utils/response');
const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('addendum-controller');

const {
  pdfWriteData,
  espiralSignature,
  microserviceRequest
} = require('./utils');

const templates = {
  stp: 'addendum-stp.html',
  asp: 'addendum-stp.html',
  opm: 'addendum-stp.html'
};

async function sendAddendumSTEE(req, res) {
  const { id, email, idSession } = res.locals.user || { id: null, email: null, idSession: null };

  const { idCommerce } = req.params;
  const { bank } = req.body;
  const addendumDate = Date.now();
  const dataSheet = {
    signature: espiralSignature,
  };

  try {
    const uniqueName = `addendum-stee-(commerce-${idCommerce})-${addendumDate}-${uuid()}.pdf`;

    const template = templates[bank];
    const pdfPath = await pdfWriteData(template, uniqueName, dataSheet);
    console.log(pdfPath);

    const responseTransfer = await microserviceRequest('stee', idCommerce, addendumDate, req.get('authorization', req), {
      bank
    });

    const accountList = responseTransfer.map(clabe => ({
      bank: bank.toUpperCase(),
      clabe: clabe.clabe,
      commissionAmount: clabe.stpAccountClabe.account.commissionAmount,
      plans: clabe.stpAccountClabe.account.plans.name
    }));

    console.log(accountList);

    Glogger.info({
      message: 'Addendum STEE sent successfully.',
      user: {
        id,
        email,
        idSession
      },
      status: 200
    }, req);
    return res.status(200).json(response.successMessage('PDF generado correctamente'));
  } catch (error) {
    console.log(error);
    Glogger.error({
      message: 'Error sending addendum STEE.',
      user: {
        id,
        email,
        idSession
      },
      status: 500
    }, req, error);
    return res.status(500).json(response.errorMessage(500, [error.message, error.stack]));
  }
}

module.exports = sendAddendumSTEE;
