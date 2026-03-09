const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');
const { sendContract } = require('../controller/contract/post');
const { getContract } = require('../controller/contract/get');

router.post(
  '/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'ecommerce/contract' }),
  sendContract
);

router.get(
  '/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'ecommerce/contract' }),
  getContract
);

module.exports = router;
