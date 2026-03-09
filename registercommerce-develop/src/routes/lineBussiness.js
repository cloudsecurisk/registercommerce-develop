const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const commerceLineBussinessController = require('../controller/commerce-line-bussiness');

router.get(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  commerceLineBussinessController.getEcommerceLineBussiness,
);

router.get(
  '/asp',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  commerceLineBussinessController.getEcommerceLineBussinessASP,
);

router.get(
  '/occupation',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  commerceLineBussinessController.getOccupationASP,
);

module.exports = router;
