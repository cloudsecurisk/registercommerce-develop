const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const { sendData } = require('../controller/sgs');
const getOccupationsSGS = require('../controller/sgs/occupations');

router.post(
  '/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/sgs' }),
  sendData
);

router.get(
  '/occupations',
  hasPermitsOauthCommerceService({ route: 'commerceService', passUser: true }),
  getOccupationsSGS
);

module.exports = router;
