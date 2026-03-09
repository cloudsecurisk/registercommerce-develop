const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const statesControllerGet = require('../controller/state/get');

router.get(
  '/',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  statesControllerGet.getStates
);

module.exports = router;
