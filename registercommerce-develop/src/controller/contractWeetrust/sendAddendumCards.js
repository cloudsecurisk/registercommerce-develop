/* eslint-disable no-console */
const { v4: uuid } = require('uuid');
const response = require('../../utils/response');
const {
  pdfWriteData,
  espiralSignature,
  microserviceRequest
} = require('./utils');

const Logger = require('../../utils/logger/GLogger');

const Glogger = new Logger('addendum-controller');

async function sendAddendumCards(req, res) {
  const {
    id,
    email,
    idSession
  } = res.locals.user || { id: null, email: null, idSession: null };
  const { idCommerce } = req.params;
  const addendumDate = Date.now();
  const dataSheet = {
    signature: espiralSignature,
  };

  try {
    const uniqueName = `addendum-cards-(commerce-${idCommerce})-${addendumDate}-${uuid()}.pdf`;
    const pdfPath = await pdfWriteData('addendum-cards.html', uniqueName, dataSheet);
    console.log(pdfPath);

    const cardsResponse = await microserviceRequest('cards', idCommerce, addendumDate, req.get('authorization'), req);
    const cards = cardsResponse.map(card => ({
      cardNumber: card.number,
      commission: Number(card.account.espiralComission)
        + Number(card.account.distributorComission)
    }));
    console.log(cards, 'CARDS ***');

    Glogger.info({
      message: 'Addendum cards sent successfully.',
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
      message: 'Error sending addendum.',
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

module.exports = sendAddendumCards;
