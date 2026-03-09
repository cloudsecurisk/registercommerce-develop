const router = require('express').Router();
const { hasPermitsOauthCommerceService } = require('../middleware/permits');

const {
  sendCustomer,
  getRegcheqInformation,
} = require('../controller/regcheq');

router.get('/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/regcheq/admin', passUser: true }),
  getRegcheqInformation);
router.post('/:idCommerce',
  hasPermitsOauthCommerceService({ route: 'commerceService/regcheq/admin', passUser: true }),
  sendCustomer);

module.exports = router;
