const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const sendContract = require('../controller/contractWeetrust/sendContract');
const getContractWeestrust = require('../controller/contractWeetrust/get');
const sendAddendumCards = require('../controller/contractWeetrust/sendAddendumCards');
const sendAddendumStee = require('../controller/contractWeetrust/sendAddendumStee');
const { deleteContract } = require('../controller/contractWeetrust/deleteContract');

router.get(
  '/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/contractWeetrust' }),
  getContractWeestrust.getContractWeestrust
);

router.post(
  '/delete/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/contractWeetrust' }),
  deleteContract
);

router.post(
  '/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/contractWeetrust' }),
  sendContract
);
router.post(
  '/addendum-cards/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/contractWeetrust' }),
  sendAddendumCards
);
router.post(
  '/addendum-stee/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/contractWeetrust' }),
  sendAddendumStee
);

module.exports = router;
