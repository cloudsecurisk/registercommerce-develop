const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const countriesController = require('../controller/countries');

router.get(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  countriesController.getCountries
);

module.exports = router;
