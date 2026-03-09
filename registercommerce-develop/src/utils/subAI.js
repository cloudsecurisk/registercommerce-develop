
const fetch = require('node-fetch');
const config = require('config');

const transferURL = config.get('transfer.stpBase');
const mposURL = config.get('mpos.base');
const ecommerceURL = config.get('ecommerce.base');
const cardsURL = config.get('cards.base');


async function getAccountsAi({ idStee, idCommerce }, apikey) {
  return fetch(`${transferURL}/commerce/accountAlertData?${idStee !== null && idStee !== undefined
    ? `idStee=${idStee}`
    : `idCommerce=${idCommerce}`
  }`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apikey
    }
  })
    .then(res => res.json())
    .then((data) => {
      if (data.status === 200) {
        return data.payload;
      }
      return {};
    })
    .catch((err) => {
      console.log(err);
      return {};
    });
}

async function getMposAi(idCommerce) {
  return fetch(`${mposURL}/commerce/count/${idCommerce}`)
    .then(res => res.json())
    .then((data) => {
      if (data.status === 200) {
        return data.payload;
      }
      return {};
    })
    .catch((err) => {
      console.log(err);
      return {};
    });
}

async function getEcommerceAi(idCommerce) {
  return fetch(`${ecommerceURL}/ecommerce/count/${idCommerce}`)
    .then(res => res.json())
    .then((data) => {
      if (data.payload) {
        return data.payload;
      }
      return {};
    })
    .catch((err) => {
      console.log(err);
      return {};
    });
}

async function getCardsAi(idCommerce) {
  return fetch(`${cardsURL}/account/count/${idCommerce}`)
    .then(res => res.json())
    .then((data) => {
      if (data.status === 200) {
        return data.payload;
      }
      return {};
    })
    .catch((err) => {
      console.log(err);
      return {};
    });
}

module.exports = {
  getAccountsAi,
  getMposAi,
  getEcommerceAi,
  getCardsAi
};
