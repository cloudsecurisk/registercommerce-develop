const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const cityController = require('../controller/city/get');

router.get(
  '/:id',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  cityController.getCountries
);

module.exports = router;
